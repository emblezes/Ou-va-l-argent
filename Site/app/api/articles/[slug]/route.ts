import { NextResponse } from 'next/server'

const NOTION_SECRET = process.env.NOTION_SECRET || ''
const ARTICLES_DB_ID = process.env.ARTICLES_DB_ID || '31694e12-0e7a-8161-9f79-c6ae37f0e838'

function richTextToMarkdown(richText: any[]): string {
  return (richText || []).map((t: any) => {
    let text = t.plain_text || ''
    if (t.annotations?.bold) text = `**${text}**`
    if (t.annotations?.italic) text = `*${text}*`
    if (t.annotations?.code) text = `\`${text}\``
    if (t.href) text = `[${text}](${t.href})`
    return text
  }).join('')
}

function notionBlocksToMarkdown(blocks: any[]): string {
  return blocks.map((block: any) => {
    const type = block.type
    switch (type) {
      case 'paragraph':
        return richTextToMarkdown(block.paragraph?.rich_text)
      case 'heading_2':
        return `## ${richTextToMarkdown(block.heading_2?.rich_text)}`
      case 'heading_3':
        return `### ${richTextToMarkdown(block.heading_3?.rich_text)}`
      case 'bulleted_list_item':
        return `- ${richTextToMarkdown(block.bulleted_list_item?.rich_text)}`
      case 'numbered_list_item':
        return `1. ${richTextToMarkdown(block.numbered_list_item?.rich_text)}`
      case 'quote':
        return `> ${richTextToMarkdown(block.quote?.rich_text)}`
      default:
        return ''
    }
  }).filter(Boolean).join('\n\n')
}

async function notionQuery(filter: any) {
  const res = await fetch(`https://api.notion.com/v1/databases/${ARTICLES_DB_ID}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_SECRET}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({ filter, page_size: 1 }),
    next: { revalidate: 60 },
  })
  return res.json()
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!ARTICLES_DB_ID || !NOTION_SECRET) {
    return NextResponse.json(
      { error: 'Configuration Notion manquante' },
      { status: 500 }
    )
  }

  try {
    const { slug } = await params

    const data = await notionQuery({
      and: [
        { property: 'Slug', rich_text: { equals: slug } },
        { property: 'Statut', select: { equals: 'Publié' } },
      ]
    })

    if (!data.results || data.results.length === 0) {
      return NextResponse.json(
        { error: 'Article non trouvé' },
        { status: 404 }
      )
    }

    const page: any = data.results[0]
    const props = page.properties

    // Fetch page blocks (full article content)
    const blocksRes = await fetch(`https://api.notion.com/v1/blocks/${page.id}/children?page_size=100`, {
      headers: {
        'Authorization': `Bearer ${NOTION_SECRET}`,
        'Notion-Version': '2022-06-28',
      },
      next: { revalidate: 60 },
    })
    const blocksData = await blocksRes.json()
    const contenu = notionBlocksToMarkdown(blocksData.results || [])

    const heroUrl = props['Image Hero']?.files?.[0]?.file?.url ||
                    props['Image Hero']?.files?.[0]?.external?.url || null
    const articleSlug = props['Slug']?.rich_text?.[0]?.plain_text || ''

    const article = {
      id: page.id,
      titre: props['Titre']?.title?.[0]?.plain_text || '',
      slug: articleSlug,
      type: props['Type']?.select?.name || 'News',
      categorie: props['Categorie']?.select?.name || '',
      date: props['Date']?.date?.start || page.created_time?.split('T')[0],
      contenu,
      chapeau: props['Chapeau']?.rich_text?.[0]?.plain_text || '',
      sources: props['Sources']?.rich_text?.[0]?.plain_text || '',
      source_url: props['Source URL']?.url || null,
      tags: props['Tags']?.multi_select?.map((t: any) => t.name) || [],
      temps_lecture: props['Temps lecture']?.number || 3,
      hero_url: heroUrl || `/news/heroes/${articleSlug}.png`,
    }

    return NextResponse.json({ article })
  } catch (error) {
    console.error('GET article error:', error)
    return NextResponse.json(
      { error: 'Impossible de charger l\'article' },
      { status: 500 }
    )
  }
}
