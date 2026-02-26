import { NextResponse } from 'next/server'
import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_SECRET })
const PROPOSITIONS_DB_ID = 'bf1c3423e700407e8e4a3589b93f9885'

interface ProposalBody {
  titre: string
  description: string
  prenom: string
  nom: string
  email: string
}

export async function POST(request: Request) {
  try {
    const body: ProposalBody = await request.json()
    const { titre, description, prenom, nom, email } = body

    // Validation
    if (!titre || !description || !prenom || !nom || !email) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    if (!email.includes('@')) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      )
    }

    if (titre.length < 10) {
      return NextResponse.json(
        { error: 'Le titre doit contenir au moins 10 caractères' },
        { status: 400 }
      )
    }

    if (description.length < 50) {
      return NextResponse.json(
        { error: 'La description doit contenir au moins 50 caractères' },
        { status: 400 }
      )
    }

    await notion.pages.create({
      parent: { database_id: PROPOSITIONS_DB_ID },
      properties: {
        'Titre': {
          title: [{ text: { content: titre } }],
        },
        'Description': {
          rich_text: [{ text: { content: description } }],
        },
        'Prénom': {
          rich_text: [{ text: { content: prenom } }],
        },
        'Nom': {
          rich_text: [{ text: { content: nom } }],
        },
        'Email': {
          email: email,
        },
        'Statut': {
          select: { name: 'Nouvelle' },
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Votre proposition a été enregistrée. Merci !',
    })
  } catch (error) {
    console.error('Proposal error:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}
