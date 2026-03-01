import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import ArticleContent from './ArticleContent'
import { notFound } from 'next/navigation'

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

async function getArticle(slug: string) {
  if (!ARTICLES_DB_ID || !NOTION_SECRET) return null

  try {
    const res = await fetch(`https://api.notion.com/v1/databases/${ARTICLES_DB_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_SECRET}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({
        filter: {
          and: [
            { property: 'Slug', rich_text: { equals: slug } },
            { property: 'Statut', select: { equals: 'Publié' } },
          ]
        },
        page_size: 1,
      }),
      next: { revalidate: 60 },
    })

    const data = await res.json()
    if (!data.results || data.results.length === 0) return null

    const page: any = data.results[0]
    const props = page.properties

    // Fetch page blocks for full article content
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

    return {
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
  } catch {
    return null
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    return { title: 'Article non trouvé' }
  }

  // For OG tags, ensure absolute URL
  const heroOgUrl = article.hero_url?.startsWith('http')
    ? article.hero_url
    : `https://ouvalargent.com${article.hero_url || `/news/heroes/${article.slug}.png`}`

  return {
    title: `${article.titre} — Où Va l'Argent`,
    description: article.chapeau,
    keywords: article.tags,
    openGraph: {
      title: article.titre,
      description: article.chapeau,
      type: 'article',
      locale: 'fr_FR',
      url: `https://ouvalargent.com/news/${article.slug}`,
      publishedTime: article.date,
      authors: ['Où Va l\'Argent'],
      tags: article.tags,
      images: [{ url: heroOgUrl, width: 1200, height: 630, alt: article.titre }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.titre,
      description: article.chapeau,
      images: [heroOgUrl],
    },
    alternates: {
      canonical: `https://ouvalargent.com/news/${article.slug}`,
    },
  }
}

export default async function ArticlePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    notFound()
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.titre,
    description: article.chapeau,
    datePublished: article.date,
    dateModified: article.date,
    author: {
      '@type': 'Organization',
      name: 'Où Va l\'Argent',
      url: 'https://ouvalargent.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Où Va l\'Argent',
      url: 'https://ouvalargent.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ouvalargent.com/og-default.png',
      },
    },
    mainEntityOfPage: `https://ouvalargent.com/news/${article.slug}`,
    image: article.hero_url || 'https://ouvalargent.com/og-default.png',
    articleSection: article.categorie,
    keywords: article.tags.join(', '),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs items={[
        { label: 'News', href: '/news' },
        { label: article.titre },
      ]} />
      <ArticleContent article={article} />
    </>
  )
}
