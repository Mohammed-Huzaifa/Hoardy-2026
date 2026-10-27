import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'

export interface PostMeta {
  slug: string
  title: string
  date: string // ISO date, e.g. 2026-09-09
  displayDate: string // human-readable
  excerpt: string
  author: string
  tags: string[]
  section: string // articleSection — first tag, or frontmatter `section`
  cover?: string
  coverAlt?: string
  draft: boolean
  readingTime: string
  wordCount: number
  faqs: Faq[]
}

export interface Faq {
  q: string
  a: string
}


export interface Post extends PostMeta {
  contentHtml: string
}

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')
const PUBLIC_DIR = path.join(process.cwd(), 'public')
const WORDS_PER_MINUTE = 200

/**
 * Auto hero cover (the founder's documented contract — see content/blog/README.md):
 * publish `public/blog/<slug>/hero.png` and the template uses it as the 16:9 article
 * cover / index-card image / social image. A `<Figure>` must NOT be added for the hero
 * (it would render twice), so this fallback lives here, not in the post body.
 */
const HERO_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp']

function heroCover(slug: string): string | undefined {
  for (const ext of HERO_EXTENSIONS) {
    const file = path.join(PUBLIC_DIR, 'blog', slug, `hero.${ext}`)
    if (fs.existsSync(file)) return `/blog/${slug}/hero.${ext}`
  }
  return undefined
}

/** Drafts are excluded from production exports; set BLOG_INCLUDE_DRAFTS=1 to preview them. */
export const includeDrafts = process.env.BLOG_INCLUDE_DRAFTS === '1'

const POST_EXT = /\.(md|mdx)$/i

/** Files starting with `_` are templates; README files are docs — never posts. */
const isPostFile = (f: string) =>
  POST_EXT.test(f) && !f.startsWith('_') && f.toLowerCase() !== 'readme.md'

/* ------------------------------------------------------------------ *
 * Frontmatter helpers
 * ------------------------------------------------------------------ */

function parseDate(raw: unknown): Date | null {
  // gray-matter/js-yaml turns YAML date-only scalars into Date objects.
  if (raw instanceof Date) return Number.isNaN(raw.getTime()) ? null : raw
  if (typeof raw !== 'string') return null
  const d = new Date(raw)
  return Number.isNaN(d.getTime()) ? null : d
}

function dateKey(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(
    d.getUTCDate()
  ).padStart(2, '0')}`
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function readingTime(text: string): string {
  const words = text.trim().split(/\s+/).length
  return `${Math.max(1, Math.round(words / WORDS_PER_MINUTE))} min read`
}

function stripMarkdown(md: string): string {
  return md
    .replace(/<[^>]+>/g, ' ') // JSX/MDX components
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Word count of the article body — feeds BlogPosting.wordCount. */
function countWords(md: string): number {
  return stripMarkdown(md).split(/\s+/).filter(Boolean).length
}

/** Inline markdown → plain text, without destroying hyphens or apostrophes. */
function cleanInline(s: string): string {
  return s
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Pulls the FAQ section out of the body so it can be emitted as FAQPage schema —
 * the markup that makes an article eligible for direct Q&A extraction by search
 * engines and AI assistants.
 *
 * Recognises a `## Questions …` / `## FAQ …` heading, then `**Question**` blocks
 * (both founder posts format every question as a bold line) up to the next H2.
 */
function extractFaqs(md: string): Faq[] {
  const lines = md.split(/\r?\n/)
  const start = lines.findIndex((l) => /^##\s+/.test(l) && /\b(questions?|faqs?)\b/i.test(l))
  if (start === -1) return []

  const faqs: Faq[] = []
  let current: { q: string; a: string[] } | null = null

  const flush = () => {
    if (!current) return
    const q = cleanInline(current.q)
    const a = cleanInline(current.a.join(' '))
    if (q && a) faqs.push({ q, a })
    current = null
  }

  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i]
    if (/^##\s+/.test(line)) break // next section ends the FAQ
    const question = line.match(/^\*\*(.+?)\*\*\s*$/)
    if (question) {
      flush()
      current = { q: question[1], a: [] }
      continue
    }
    if (current && line.trim()) current.a.push(line.trim())
  }
  flush()

  return faqs
}


/* ------------------------------------------------------------------ *
 * MDX → HTML (the founder's posts use <Figure> and <PullQuote>)
 * ------------------------------------------------------------------ */

const escapeAttr = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function parseAttrs(raw: string): Record<string, string> {
  const out: Record<string, string> = {}
  const re = /([\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|\{([^}]*)\})/g
  let m: RegExpExecArray | null
  while ((m = re.exec(raw))) out[m[1]] = (m[2] ?? m[3] ?? m[4] ?? '').trim()
  return out
}

/**
 * Minimal MDX transform: pulls the two registered components out of the source,
 * renders the remaining markdown with `marked`, then re-injects the components as
 * equivalent HTML. No React runtime needed — everything is rendered at build time.
 */
function renderMdx(source: string): string {
  const tokens: string[] = []
  const keep = (html: string) => {
    tokens.push(html)
    return `\n\n<!--mdx:${tokens.length - 1}-->\n\n`
  }

  let out = source

  // <Figure src="…" alt="…" caption="…" width={1600} height={1067} />
  out = out.replace(/<Figure\b([\s\S]*?)\/>/g, (_full, attrsRaw: string) => {
    const a = parseAttrs(attrsRaw)
    if (!a.src) return ''
    const dims = `${a.width ? ` width="${a.width}"` : ''}${a.height ? ` height="${a.height}"` : ''}`
    const caption = a.caption
      ? `<figcaption>${(marked.parseInline(a.caption) as string).trim()}</figcaption>`
      : ''
    return keep(
      `<figure class="blog-figure"><img src="${a.src}" alt="${escapeAttr(a.alt || '')}"${dims} loading="lazy" decoding="async" />${caption}</figure>`
    )
  })

  // <PullQuote>…</PullQuote>
  out = out.replace(/<PullQuote>([\s\S]*?)<\/PullQuote>/g, (_full, text: string) =>
    keep(`<blockquote class="blog-pullquote">${(marked.parseInline(text.trim()) as string)}</blockquote>`)
  )

  const html = marked.parse(out) as string
  return html
    .replace(/<p>\s*<!--mdx:(\d+)-->\s*<\/p>/g, (_m, i) => tokens[Number(i)])
    .replace(/<!--mdx:(\d+)-->/g, (_m, i) => tokens[Number(i)])
}

/* ------------------------------------------------------------------ *
 * Post reading
 * ------------------------------------------------------------------ */

interface PostFile {
  slug: string
  file: string
}

function listPostFiles(): PostFile[] {
  if (!fs.existsSync(BLOG_DIR)) return []
  const bySlug = new Map<string, PostFile>()
  for (const f of fs.readdirSync(BLOG_DIR)) {
    if (!isPostFile(f)) continue
    const ext = path.extname(f).toLowerCase()
    const slug = f.slice(0, -ext.length)
    const existing = bySlug.get(slug)
    // Prefer .mdx over .md when both exist for the same slug.
    if (!existing || (ext === '.mdx' && !existing.file.toLowerCase().endsWith('.mdx'))) {
      bySlug.set(slug, { slug, file: f })
    }
  }
  return Array.from(bySlug.values())
}

function readPost(file: PostFile): Post {
  const raw = fs.readFileSync(path.join(BLOG_DIR, file.file), 'utf8')
  const { data, content } = matter(raw)

  const title = typeof data.title === 'string' && data.title.trim() ? data.title.trim() : file.slug
  const author =
    typeof data.author === 'string' && data.author.trim() ? data.author.trim() : 'hoardy.ai'
  const tags = Array.isArray(data.tags)
    ? data.tags.filter((t): t is string => typeof t === 'string')
    : []
  const cover = typeof data.cover === 'string' && data.cover.trim() ? data.cover.trim() : undefined
  const draft = data.draft === true || data.draft === 'true'

  // `dek` is the founder's schema for the teaser; `excerpt` also supported.
  const teaser =
    (typeof data.dek === 'string' && data.dek.trim()) ||
    (typeof data.excerpt === 'string' && data.excerpt.trim()) ||
    ''

  const excerpt = teaser || stripMarkdown(content).slice(0, 200)

  const date = parseDate(data.date)
  if (!date) {
    throw new Error(`[blog] "${file.file}" is missing a valid YAML \`date:\` field (YYYY-MM-DD)`)
  }

  // Cover resolution — the founder's contract, in order:
  //   1. explicit `cover:` in frontmatter
  //   2. auto hero at /blog/<slug>/hero.png (see HERO_EXTENSIONS above)
  //   3. first in-body <Figure> image, as a last resort
  const firstImage = content.match(/<Figure[^>]*src="([^"]+)"/)?.[1]
  const resolvedCover = cover || heroCover(file.slug) || firstImage

  // Cover alt text. A decorative-looking hero still needs a real alt: it is the
  // first image a crawler or screen reader meets on the article, and an empty one
  // counts as a missing alt in every audit.
  const coverAlt =
    (typeof data.coverAlt === 'string' && data.coverAlt.trim()) ||
    content.match(/<Figure[^>]*alt="([^"]+)"/)?.[1] ||
    `${title} — ${author} article cover`

  const faqs = extractFaqs(content)

  const section =
    (typeof data.section === 'string' && data.section.trim()) || tags[0] || 'Engineering'

  return {
    slug: file.slug,
    title,
    date: dateKey(date),
    displayDate: formatDate(date),
    excerpt,
    author,
    tags,
    section,
    cover: resolvedCover,
    coverAlt: resolvedCover ? coverAlt : undefined,
    draft,
    readingTime: readingTime(stripMarkdown(content)),
    wordCount: countWords(content),
    faqs,
    contentHtml: renderMdx(content),
  }
}

/** All published posts, newest first. Drafts only when BLOG_INCLUDE_DRAFTS=1. */
export function getAllPosts(): Post[] {
  return listPostFiles()
    .map(readPost)
    .filter((p) => includeDrafts || !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPostBySlug(slug: string): Post | undefined {
  const file = listPostFiles().find((f) => f.slug === slug)
  if (!file) return undefined
  try {
    const post = readPost(file)
    if (post.draft && !includeDrafts) return undefined
    return post
  } catch {
    return undefined
  }
}
