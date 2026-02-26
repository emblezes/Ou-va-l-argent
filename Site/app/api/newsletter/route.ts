import { NextResponse } from 'next/server'
import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_SECRET })
const NEWSLETTER_DB_ID = 'eed7fa6770a1422d82fbb97373d9e3f5'

export async function POST(request: Request) {
  try {
    const { email, source } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      )
    }

    await notion.pages.create({
      parent: { database_id: NEWSLETTER_DB_ID },
      properties: {
        'Email': {
          title: [{ text: { content: email } }],
        },
        'Source': {
          select: { name: source || 'Homepage' },
        },
        'Statut': {
          select: { name: 'Actif' },
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Inscription réussie !',
    })
  } catch (error) {
    console.error('Newsletter error:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}
