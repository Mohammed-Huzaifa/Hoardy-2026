#!/usr/bin/env node
/**
 * Generates every machine-readable discovery artifact from the real content set.
 * Runs automatically via the `prebuild` npm hook, so new posts are picked up with
 * zero manual XML editing.
 *
 * Emits:
 *   public/sitemap.xml          — search engines
 *   public/blog/rss.xml         — feed readers + AI news/freshness bots
 *   public/llms.txt             — the index LLMs/agents look for (llmstxt.org)
 *   public/llms-full.txt        — full text of every published page in one file
 *   public/index.md             — homepage in markdown
 *   public/services.md          — the offering in markdown (buying agents)
 *   public/blog/<slug>.md       — per-article markdown mirrors
 *
 * All output is derived; nothing here should be edited by hand.
 */
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const ROOT = process.cwd()
const SITE = 'https://hoardy.ai'
const BLOG_DIR = path.join(ROOT, 'content', 'blog')
const LEGAL_DIR = path.join(ROOT, 'content', 'legal')
const PUBLIC_DIR = path.join(ROOT, 'public')

const BRAND = 'Hoardy'
const LEGAL_NAME = '11371096 Canada Inc.'
const ONE_LINER =
  'Hoardy is a Toronto-based boutique technology agency that builds AI agents and assistants, web and app products, product design, QA and maintenance, VR and immersive experiences, and the technical strategy behind them.'

const SERVICES = [
  {
    name: 'AI Agents & Assistants',
    description:
      'Custom AI agent setup, LLM integration, and workflow automation that augment your team, not replace it. Scoped from the workflow out, with human approval gates and an exception path.',
    tags: ['LLM integration', 'Workflow automation', 'Intelligent assistants'],
  },
  {
    name: 'Web & App Development',
    description:
      'Full-stack web apps, responsive marketing sites, and progressive web experiences built performance-first, including Next.js static builds, e-commerce and CMS integrations.',
    tags: ['Full-stack', 'Responsive', 'PWA'],
  },
  {
    name: 'Product Design (UI/UX)',
    description:
      'Research, information architecture, interface design, and design systems delivered as Figma specs a developer can build from without guessing.',
    tags: ['Research', 'Interface design', 'Design systems'],
  },
  {
    name: 'QA & Maintenance',
    description:
      'Manual and automated testing, regression suites, accessibility and performance audits, and ongoing maintenance for sites and apps already in market.',
    tags: ['Test automation', 'Accessibility', 'Performance'],
  },
  {
    name: 'VR & Immersive Tech',
    description:
      'WebGL and three.js experiences, 3D product visualisation, and headset-ready immersive builds for brands that need something physical-feeling.',
    tags: ['WebGL', '3D', 'Spatial'],
  },
  {
    name: 'Technical Strategy',
    description:
      'Architecture decisions, stack selection, delivery planning, and the audit work that tells a founder what to build first and what to leave alone.',
    tags: ['Architecture', 'Delivery planning', 'Audits'],
  },
]

const today = new Date().toISOString().slice(0, 10)

/* ------------------------------------------------------------------ *
 * Content helpers
 * ------------------------------------------------------------------ */

function postFiles() {
  if (!fs.existsSync(BLOG_DIR)) return []
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => /\.(md|mdx)$/i.test(f) && !f.startsWith('_') && f.toLowerCase() !== 'readme.md')
}

function asDateKey(raw, fallback) {
  // gray-matter/js-yaml turns YYYY-MM-DD scalars into Date objects.
  if (raw instanceof Date) return raw.toISOString().slice(0, 10)
  const s = String(raw ?? '').trim()
  const m = s.match(/^(\d{4}-\d{2}-\d{2})/)
  return m ? m[1] : fallback
}

function mtimeKey(file) {
  return new Date(fs.statSync(file).mtime).toISOString().slice(0, 10)
}

/** MDX → plain markdown: registered components become their markdown equivalents. */
function mdxToMarkdown(src) {
  return src
    .replace(/<Figure\b([\s\S]*?)\/>/g, (_full, attrs) => {
      const get = (k) => {
        const m = attrs.match(new RegExp(`${k}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`))
        return m ? (m[1] ?? m[2] ?? '') : ''
      }
      const src_ = get('src')
      if (!src_) return ''
      const alt = get('alt')
      const caption = get('caption')
      return `![${alt}](${src_})${caption ? `\n\n*${caption}*` : ''}`
    })
    .replace(/<PullQuote>([\s\S]*?)<\/PullQuote>/g, (_full, text) => `> ${text.trim()}`)
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function stripMarkdown(md) {
  return md
    .replace(/<[^>]+>/g, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function wordCount(md) {
  return stripMarkdown(md).split(/\s+/).filter(Boolean).length
}

function xmlEscape(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/* ------------------------------------------------------------------ *
 * Read the content set
 * ------------------------------------------------------------------ */

const posts = []
for (const file of postFiles()) {
  const full = path.join(BLOG_DIR, file)
  const { data, content } = matter(fs.readFileSync(full, 'utf8'))
  if (data.draft === true || data.draft === 'true') continue
  const slug = file.replace(/\.(md|mdx)$/i, '')
  const cover = fs.existsSync(path.join(PUBLIC_DIR, 'blog', slug, 'hero.png'))
    ? `/blog/${slug}/hero.png`
    : typeof data.cover === 'string'
      ? data.cover
      : undefined
  const teaser =
    (typeof data.dek === 'string' && data.dek.trim()) ||
    (typeof data.excerpt === 'string' && data.excerpt.trim()) ||
    ''
  const body = mdxToMarkdown(content)
  posts.push({
    slug,
    file: full,
    title: String(data.title ?? slug).trim(),
    date: asDateKey(data.date, today),
    dek: teaser || stripMarkdown(content).slice(0, 200),
    tags: Array.isArray(data.tags) ? data.tags.filter((t) => typeof t === 'string') : [],
    author: typeof data.author === 'string' ? data.author.trim() : BRAND,
    cover,
    body,
    words: wordCount(content),
  })
}
posts.sort((a, b) => (a.date < b.date ? 1 : -1))

const latestPost = posts[0]

const LEGAL_PAGES = [
  { slug: 'privacy', file: 'privacy-policy.md', title: 'Privacy Policy' },
  { slug: 'terms', file: 'terms-of-service.md', title: 'Terms of Service' },
].map((p) => {
  const full = path.join(LEGAL_DIR, p.file)
  const exists = fs.existsSync(full)
  return { ...p, exists, lastmod: exists ? mtimeKey(full) : today }
})

const write = (rel, body) => {
  const out = path.join(PUBLIC_DIR, rel)
  fs.mkdirSync(path.dirname(out), { recursive: true })
  fs.writeFileSync(out, body)
  return out
}

/* ------------------------------------------------------------------ *
 * 1. sitemap.xml
 * ------------------------------------------------------------------ */

const sitemapUrls = [
  { loc: `${SITE}/`, lastmod: latestPost?.date ?? today, changefreq: 'weekly', priority: '1.0' },
  { loc: `${SITE}/blog/`, lastmod: latestPost?.date ?? today, changefreq: 'weekly', priority: '0.8' },
  ...posts.map((p) => ({
    loc: `${SITE}/blog/${p.slug}/`,
    lastmod: p.date,
    changefreq: 'monthly',
    priority: '0.7',
    image: p.cover ? `${SITE}${p.cover}` : undefined,
  })),
  ...LEGAL_PAGES.filter((p) => p.exists).map((p) => ({
    loc: `${SITE}/${p.slug}/`,
    lastmod: p.lastmod,
    changefreq: 'yearly',
    priority: '0.3',
  })),
]

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${sitemapUrls
  .map(
    (u) => `  <url>
    <loc>${xmlEscape(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>${
      u.image
        ? `\n    <image:image><image:loc>${xmlEscape(u.image)}</image:loc></image:image>`
        : ''
    }
  </url>`
  )
  .join('\n')}
</urlset>
`
write('sitemap.xml', sitemapXml)

/* ------------------------------------------------------------------ *
 * 2. RSS 2.0 feed  (/blog/rss.xml — also mirrored at /rss.xml)
 * ------------------------------------------------------------------ */

const rssItems = posts
  .slice(0, 20)
  .map((p) => {
    const url = `${SITE}/blog/${p.slug}/`
    return `    <item>
      <title>${xmlEscape(p.title)}</title>
      <link>${xmlEscape(url)}</link>
      <guid isPermaLink="true">${xmlEscape(url)}</guid>
      <pubDate>${new Date(`${p.date}T09:00:00Z`).toUTCString()}</pubDate>
      <description>${xmlEscape(p.dek)}</description>
${p.tags.map((t) => `      <category>${xmlEscape(t)}</category>`).join('\n')}
    </item>`
  })
  .join('\n')

const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>hoardy.ai — Notes from the build</title>
    <link>${SITE}/blog/</link>
    <description>How we ship AI agents, websites, and immersive products for brands.</description>
    <language>en-ca</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE}/blog/rss.xml" rel="self" type="application/rss+xml" />
${rssItems}
  </channel>
</rss>
`
write('blog/rss.xml', rssXml)
write('rss.xml', rssXml)

/* ------------------------------------------------------------------ *
 * 3. llms.txt  (llmstxt.org spec: H1, blockquote summary, link sections)
 * ------------------------------------------------------------------ */

const llmsTxt = `# hoardy.ai

> ${ONE_LINER} We work with brands and founders across Toronto, Mississauga, the GTA and Canada, and with clients worldwide. Legal entity: ${LEGAL_NAME} Contact: maaz@hoardy.ai.

## About

- [Home](${SITE}/): what Hoardy does, who it works with, the six service lines, and the delivery process.
- [Services](${SITE}/services.md): every service line with scope, tags and who it is for, in markdown.
- [Contact](${SITE}/#contact): project enquiry form. We answer within a day.

## Articles

${posts.map((p) => `- [${p.title}](${SITE}/blog/${p.slug}/): ${p.dek.replace(/\s+/g, ' ')} (${p.date})`).join('\n')}

## Legal

${LEGAL_PAGES.filter((p) => p.exists)
  .map((p) => `- [${p.title}](${SITE}/${p.slug}/): ${p.title.toLowerCase()} for hoardy.ai, operated by ${LEGAL_NAME}`)
  .join('\n')}

## Company facts

- Name: ${BRAND} (hoardy.ai)
- Legal name: ${LEGAL_NAME}
- Location: Toronto, Ontario, Canada. Serving Mississauga, the Greater Toronto Area, Canada and remote clients worldwide.
- Email: maaz@hoardy.ai
- LinkedIn: https://www.linkedin.com/company/hoardy/
- X: https://x.com/hoardyAI
- Services: ${SERVICES.map((s) => s.name).join(', ')}.

## Optional

- [llms-full.txt](${SITE}/llms-full.txt): the full text of every published page in one file.
- [Sitemap](${SITE}/sitemap.xml)
- [RSS](${SITE}/blog/rss.xml)
`
write('llms.txt', llmsTxt)

/* ------------------------------------------------------------------ *
 * 4. llms-full.txt — everything, in one fetch
 * ------------------------------------------------------------------ */

const fullParts = [
  `# hoardy.ai — full site text`,
  ``,
  `> ${ONE_LINER}`,
  ``,
  `Legal entity: ${LEGAL_NAME} Location: Toronto, Ontario, Canada, serving Mississauga, the GTA, Canada and clients worldwide. Contact: maaz@hoardy.ai. LinkedIn: https://www.linkedin.com/company/hoardy/ · X: https://x.com/hoardyAI`,
  ``,
  `---`,
  ``,
  `# hoardy.ai — Built for brands. Ready for agents.`,
  ``,
  ONE_LINER,
  ``,
  `## What we do`,
  ``,
  SERVICES.map((s) => `### ${s.name}\n\n${s.description}\n\nTags: ${s.tags.join(', ')}`).join('\n\n'),
  ``,
  `## Contact`,
  ``,
  `Email maaz@hoardy.ai or use the form at ${SITE}/#contact. We answer within a day.`,
  ``,
]

for (const p of posts) {
  fullParts.push(
    `---`,
    ``,
    `# ${p.title}`,
    ``,
    `Published ${p.date} · ${p.author} · ${p.words} words · ${SITE}/blog/${p.slug}/`,
    ``,
    `> ${p.dek}`,
    ``,
    p.body,
    ``
  )
}

for (const page of LEGAL_PAGES.filter((p) => p.exists)) {
  const { content } = matter(fs.readFileSync(path.join(LEGAL_DIR, page.file), 'utf8'))
  fullParts.push(`---`, ``, `# ${page.title}`, ``, content.trim(), ``)
}

write('llms-full.txt', fullParts.join('\n'))

/* ------------------------------------------------------------------ *
 * 5. Markdown mirrors — /index.md, /services.md, /blog/<slug>.md
 * ------------------------------------------------------------------ */

const servicesMd = `# Hoardy services

${ONE_LINER}

- Legal entity: ${LEGAL_NAME}
- Location: Toronto, Ontario, Canada — serving Mississauga, the Greater Toronto Area, Canada, and remote clients worldwide.
- Contact: maaz@hoardy.ai
- Website: ${SITE}/
- Typical engagement: scoped project or ongoing retainer. First conversation is free and answers within a day.

${SERVICES.map(
  (s, i) => `## ${i + 1}. ${s.name}

${s.description}

Tags: ${s.tags.join(', ')}
`
).join('\n')}
## How we work

1. **Discover** — understand the business, the users, and what success looks like.
2. **Define** — scope, architecture, and a plan with dates.
3. **Design** — interface, system design, and design system in Figma.
4. **Build** — engineering in short cycles, reviewed continuously.
5. **Launch** — QA gates, performance budgets, accessibility checks.
6. **Maintain** — monitoring, iteration, and support after release.

## Contact

Email maaz@hoardy.ai or use the form at ${SITE}/#contact.
`
write('services.md', servicesMd)

const indexMd = `# hoardy.ai — Built for brands. Ready for agents.

${ONE_LINER}

- Legal entity: ${LEGAL_NAME}
- Location: Toronto, Ontario, Canada — serving Mississauga, the Greater Toronto Area, Canada, and remote clients worldwide.
- Contact: maaz@hoardy.ai
- LinkedIn: https://www.linkedin.com/company/hoardy/
- X: https://x.com/hoardyAI

## Services

${SERVICES.map((s) => `- **${s.name}** — ${s.description}`).join('\n')}

Full detail: ${SITE}/services.md

## Articles

${posts.map((p) => `- [${p.title}](${SITE}/blog/${p.slug}/) — ${p.dek.replace(/\s+/g, ' ')} (${p.date})`).join('\n')}

## Contact

Email maaz@hoardy.ai or use the form at ${SITE}/#contact. We answer within a day.
`
write('index.md', indexMd)

for (const p of posts) {
  write(
    `blog/${p.slug}.md`,
    `# ${p.title}

${p.dek}

Published ${p.date} by ${p.author}. Canonical: ${SITE}/blog/${p.slug}/
${p.tags.length ? `Tags: ${p.tags.join(', ')}\n` : ''}
${p.body}

---

Contact: maaz@hoardy.ai · ${SITE}/#contact
`
  )
}

/* ------------------------------------------------------------------ *
 * Report
 * ------------------------------------------------------------------ */

console.log(
  [
    `✓ sitemap.xml      — ${sitemapUrls.length} URLs (${posts.length} posts + home + blog + legal)`,
    `✓ blog/rss.xml     — ${posts.length} items (mirrored at /rss.xml)`,
    `✓ llms.txt         — ${posts.length} articles indexed`,
    `✓ llms-full.txt    — ${fullParts.length ? 'full text of every published page' : 'empty'}`,
    `✓ index.md, services.md, ${posts.length} article mirrors`,
  ].join('\n')
)
