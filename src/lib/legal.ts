import fs from 'fs'
import path from 'path'
import { marked } from 'marked'

/**
 * Legal documents (Privacy Policy, Terms of Service) live as plain markdown in
 * content/legal/ so the founder can edit the wording without touching code.
 * Rendered to static HTML at build time — no runtime dependency.
 */
const LEGAL_DIR = path.join(process.cwd(), 'content', 'legal')

export interface LegalDoc {
  slug: LegalSlug
  title: string
  description: string
  effective: string
  updated: string
  contentHtml: string
}

export const LEGAL_DOCS = {
  privacy: {
    file: 'privacy-policy.md',
    title: 'Privacy Policy',
    description:
      'How Hoardy (11371096 Canada Inc.) collects, uses and protects personal information on hoardy.ai and in our client work.',
  },
  terms: {
    file: 'terms-of-service.md',
    title: 'Terms of Service',
    description:
      'The terms governing use of hoardy.ai and the services provided by Hoardy (11371096 Canada Inc.).',
  },
} as const

export type LegalSlug = keyof typeof LEGAL_DOCS

/** Turn "## 1. Who we are" into a stable deep-link id without extra plugins. */
function addHeadingIds(html: string): string {
  return html.replace(/<h([23])>(.*?)<\/h\1>/g, (_m, level, inner) => {
    const text = inner.replace(/<[^>]+>/g, '')
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
    return `<h${level} id="${id}">${inner}</h${level}>`
  })
}

export function getLegal(slug: LegalSlug): LegalDoc {
  const meta = LEGAL_DOCS[slug]
  const raw = fs.readFileSync(path.join(LEGAL_DIR, meta.file), 'utf8')

  const effective = raw.match(/^\*{0,2}Effective date:\*{0,2}\s*(.+)$/m)?.[1]?.trim() ?? ''
  const updated = raw.match(/^\*{0,2}Last updated:\*{0,2}\s*(.+)$/m)?.[1]?.trim() ?? effective

  // Drop the document's own H1 (the page renders its own) and the dated lines
  // (surfaced as a meta row instead) so nothing appears twice.
  const body = raw
    .replace(/^#\s+.*\r?\n/, '')
    .replace(/^\*{0,2}Effective date:\*{0,2}.*$/m, '')
    .replace(/^\*{0,2}Last updated:\*{0,2}.*$/m, '')
    .trim()

  return {
    slug,
    title: meta.title,
    description: meta.description,
    effective,
    updated,
    contentHtml: addHeadingIds(marked.parse(body) as string),
  }
}
