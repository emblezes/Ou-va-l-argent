import { NextResponse } from 'next/server'
import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_SECRET })

interface VoteBody {
  propositionId: string
  email: string
}

export async function POST(request: Request) {
  try {
    const body: VoteBody = await request.json()
    const { propositionId, email } = body

    if (!propositionId || !email) {
      return NextResponse.json(
        { error: 'propositionId et email requis' },
        { status: 400 }
      )
    }

    if (!email.includes('@') || !email.includes('.')) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      )
    }

    const page = await notion.pages.retrieve({ page_id: propositionId }) as any
    const props = page.properties

    const currentVotes = props['Votes']?.number || 0
    const votantsRaw = props['Votants']?.rich_text?.[0]?.plain_text || '[]'

    let votants: string[]
    try {
      votants = JSON.parse(votantsRaw)
      if (!Array.isArray(votants)) votants = []
    } catch {
      votants = []
    }

    const normalizedEmail = email.toLowerCase().trim()

    if (votants.includes(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Vous avez déjà voté pour cette proposition', votes: currentVotes },
        { status: 409 }
      )
    }

    votants.push(normalizedEmail)
    const newVotes = currentVotes + 1

    await notion.pages.update({
      page_id: propositionId,
      properties: {
        'Votes': { number: newVotes },
        'Votants': {
          rich_text: [{ text: { content: JSON.stringify(votants) } }],
        },
      },
    })

    return NextResponse.json({ success: true, votes: newVotes })
  } catch (error) {
    console.error('Vote error:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue lors du vote' },
      { status: 500 }
    )
  }
}
