---
# Blog post template — hoardy.ai
#
# HOW TO ADD AN ARTICLE:
#  1. Copy this file in the same folder and rename it to your post's URL slug,
#     e.g. `ai-agents-2026.md`  →  the article will live at hoardy.ai/blog/ai-agents-2026
#     (slug = filename; lowercase letters, numbers and hyphens only, NO spaces)
#  2. Fill in the frontmatter between the --- dashes (fields marked * required)
#  3. Write the article below the second --- in Markdown
#  4. Commit & push — hoardy's build pipeline picks it up automatically.
#
# Frontmatter field notes:
#  - date: ISO format YYYY-MM-DD (used for ordering + display)
#  - excerpt: 1–2 sentence summary shown on the blog index + search snippets
#  - author: as you want it displayed
#  - tags: comma-separated; shown as chips on the index card
#  - cover: optional image — drop a file in /public/blog/ and reference it like /blog/cover.jpg
#
# Supported Markdown: headings (## / ###), bold/italic, [links](https://…),
# lists (- / 1.), > quotes, ```code fences, images ![](/blog/x.jpg), and --- dividers.

title: "Your article title here"
date: 2026-01-01
excerpt: "One or two sentences that make someone want to read the whole thing."
author: "Maaz"
tags: ["AI Agents", "Strategy"]
cover: ""            # optional, e.g. /blog/cover.jpg

---

Start writing here. A strong opening paragraph — no "In this article…" filler.

## Section heading

Body text with **bold** and *emphasis*. Add [links](https://hoardy.ai) naturally.

- Bullet points
- Break up walls of text

> A pull quote works well mid-article.

### Sub-section

More detail, code if relevant:

```bash
npm run build
```

## Wrap it up

End with the takeaway or a question — then leave it to hoardy's CTA.
