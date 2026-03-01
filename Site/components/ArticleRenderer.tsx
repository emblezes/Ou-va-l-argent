'use client'

/**
 * Renders markdown content from Notion articles into styled HTML.
 * Supports: ## headings, **bold**, *italic*, > blockquotes, lists, links, line breaks
 */
export default function ArticleRenderer({ content }: { content: string }) {
  const html = markdownToHtml(content)

  return (
    <div
      className="article-content prose prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

function markdownToHtml(md: string): string {
  const lines = md.split('\n')
  const result: string[] = []
  let inList = false
  let inBlockquote = false

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]

    // Blockquote
    if (line.startsWith('> ')) {
      if (!inBlockquote) {
        result.push('<blockquote class="border-l-4 border-accent-electric/50 pl-8 my-10 text-text-secondary italic text-[2.5rem] lg:text-[3rem] leading-snug">')
        inBlockquote = true
      }
      result.push(`<p>${inlineFormat(line.slice(2))}</p>`)
      continue
    } else if (inBlockquote) {
      result.push('</blockquote>')
      inBlockquote = false
    }

    // Close list if needed
    if (inList && !line.startsWith('- ') && !line.startsWith('* ') && !line.match(/^\d+\. /)) {
      result.push('</ul>')
      inList = false
    }

    // Headings — H2 = 4rem/5rem, H3 = 3rem/4rem
    if (line.startsWith('## ')) {
      result.push(`<h2 class="font-serif text-[3.5rem] lg:text-[4.5rem] mt-14 mb-8 text-text-primary leading-tight">${inlineFormat(line.slice(3))}</h2>`)
      continue
    }
    if (line.startsWith('### ')) {
      result.push(`<h3 class="font-semibold text-[3rem] lg:text-[3.5rem] mt-12 mb-6 text-text-primary leading-tight">${inlineFormat(line.slice(4))}</h3>`)
      continue
    }

    // Lists
    if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!inList) {
        result.push('<ul class="list-disc pl-12 my-8 space-y-5 text-text-secondary text-[2.5rem] lg:text-[3rem] leading-snug">')
        inList = true
      }
      result.push(`<li>${inlineFormat(line.slice(2))}</li>`)
      continue
    }

    if (line.match(/^\d+\. /)) {
      if (!inList) {
        result.push('<ul class="list-decimal pl-12 my-8 space-y-5 text-text-secondary text-[2.5rem] lg:text-[3rem] leading-snug">')
        inList = true
      }
      result.push(`<li>${inlineFormat(line.replace(/^\d+\. /, ''))}</li>`)
      continue
    }

    // Empty line
    if (line.trim() === '') {
      continue
    }

    // Regular paragraph — corps = ancienne taille H2 (3rem/3.5rem)
    result.push(`<p class="text-text-secondary text-[2.5rem] lg:text-[3rem] leading-snug mb-8">${inlineFormat(line)}</p>`)
  }

  if (inList) result.push('</ul>')
  if (inBlockquote) result.push('</blockquote>')

  return result.join('\n')
}

function inlineFormat(text: string): string {
  // Bold
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong class="text-text-primary font-semibold">$1</strong>')
  // Italic
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>')
  // Links
  text = text.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-accent-electric hover:underline">$1</a>')
  // Inline code
  text = text.replace(/`(.+?)`/g, '<code class="px-2 py-1 bg-bg-elevated rounded text-accent-electric text-[2rem] font-mono">$1</code>')

  return text
}
