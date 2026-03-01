import { NextResponse } from 'next/server'
import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_SECRET })
const PROPOSITIONS_DB_ID = 'bf1c3423e700407e8e4a3589b93f9885'
const PROPOSITIONS_DS_ID = '925a8de1-d947-4dc3-ad02-f1fb02687678'

const CATEGORIES = [
  'Dépenses publiques', 'Impôts & taxes', 'Retraites', 'Santé',
  'Éducation', 'Défense', 'Collectivités', 'Institutions', 'Autre',
] as const

interface ProposalBody {
  titre: string
  description: string
  prenom: string
  nom: string
  email: string
  categorie?: string
}

export async function GET() {
  try {
    const response = await notion.dataSources.query({
      data_source_id: PROPOSITIONS_DS_ID,
      filter: {
        property: 'Statut',
        select: { equals: 'Approuvée' },
      },
      sorts: [{ property: 'Votes', direction: 'descending' }],
    } as any)

    const propositions = response.results.map((page: any) => {
      const props = page.properties
      return {
        id: page.id,
        titre: props['Titre']?.title?.[0]?.plain_text || '',
        description: props['Description']?.rich_text?.[0]?.plain_text || '',
        prenom: props['Prénom']?.rich_text?.[0]?.plain_text || '',
        categorie: props['Catégorie']?.select?.name || 'Autre',
        votes: props['Votes']?.number || 0,
        date: page.created_time,
      }
    })

    return NextResponse.json({ propositions })
  } catch (error) {
    console.error('GET propositions error:', error)
    return NextResponse.json(
      { error: 'Impossible de charger les propositions' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body: ProposalBody = await request.json()
    const { titre, description, prenom, nom, email, categorie } = body

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

    const validCategorie = categorie && CATEGORIES.includes(categorie as any)
      ? categorie
      : 'Autre'

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
        'Catégorie': {
          select: { name: validCategorie },
        },
        'Votes': {
          number: 0,
        },
        'Votants': {
          rich_text: [{ text: { content: '[]' } }],
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
