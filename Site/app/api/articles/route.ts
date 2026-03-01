import { NextResponse } from 'next/server'

const NOTION_SECRET = process.env.NOTION_SECRET || ''
const ARTICLES_DB_ID = process.env.ARTICLES_DB_ID || '31694e12-0e7a-8161-9f79-c6ae37f0e838'

async function notionQuery(filter: any, sorts?: any[]) {
  const res = await fetch(`https://api.notion.com/v1/databases/${ARTICLES_DB_ID}/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_SECRET}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({ filter, sorts }),
    next: { revalidate: 60 },
  })
  return res.json()
}

export async function GET(request: Request) {
  if (!ARTICLES_DB_ID || !NOTION_SECRET) {
    return NextResponse.json(
      { error: 'Configuration Notion manquante' },
      { status: 500 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const categorie = searchParams.get('categorie')

    const filters: any[] = [
      { property: 'Statut', select: { equals: 'Publié' } }
    ]

    if (type) {
      filters.push({ property: 'Type', select: { equals: type } })
    }

    if (categorie) {
      filters.push({ property: 'Categorie', select: { equals: categorie } })
    }

    const filter = filters.length === 1 ? filters[0] : { and: filters }

    const data = await notionQuery(filter, [
      { property: 'Date', direction: 'descending' }
    ])

    const articles = (data.results || []).map((page: any) => {
      const props = page.properties
      const heroUrl = props['Image Hero']?.files?.[0]?.file?.url ||
                      props['Image Hero']?.files?.[0]?.external?.url || null
      const slug = props['Slug']?.rich_text?.[0]?.plain_text || ''
      return {
        id: page.id,
        titre: props['Titre']?.title?.[0]?.plain_text || '',
        slug,
        type: props['Type']?.select?.name || 'News',
        categorie: props['Categorie']?.select?.name || '',
        date: props['Date']?.date?.start || page.created_time?.split('T')[0],
        chapeau: props['Chapeau']?.rich_text?.[0]?.plain_text || '',
        tags: props['Tags']?.multi_select?.map((t: any) => t.name) || [],
        temps_lecture: props['Temps lecture']?.number || 3,
        hero_url: heroUrl || `/news/heroes/${slug}.png`,
      }
    })

    return NextResponse.json({
      articles,
      has_more: data.has_more,
      next_cursor: data.next_cursor,
    })
  } catch (error) {
    console.error('GET articles error:', error)
    return NextResponse.json(
      { error: 'Impossible de charger les articles' },
      { status: 500 }
    )
  }
}
