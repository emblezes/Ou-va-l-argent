import { NextResponse } from 'next/server'

interface ProposalBody {
  title: string
  description: string
  firstName: string
  lastName: string
  email: string
}

export async function POST(request: Request) {
  try {
    const body: ProposalBody = await request.json()
    const { title, description, firstName, lastName, email } = body

    // Validation
    if (!title || !description || !firstName || !lastName || !email) {
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

    if (title.length < 10) {
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

    // In production, save to Sanity here:
    // import { createClient } from '@sanity/client'
    // const client = createClient({...})
    // await client.create({
    //   _type: 'proposal',
    //   title,
    //   description,
    //   author: { firstName, lastName, email },
    //   createdAt: new Date().toISOString(),
    //   votes: 0
    // })

    // Mock success for now
    console.log(`New proposal from ${firstName} ${lastName}: ${title}`)

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

export async function GET() {
  // Mock proposals list for the carousel
  const proposals = [
    {
      id: 1,
      title: 'Fusionner les 1 200 agences de l\'État en 200 structures',
      description: 'La France compte plus de 1 200 agences, opérateurs et autorités administratives.',
      author: 'Marie Dupont',
      votes: 892,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 2,
      title: 'Plafonner les indemnités des élus au salaire médian',
      description: 'Les indemnités des parlementaires devraient être alignées sur le salaire médian français.',
      author: 'Thomas Martin',
      votes: 1247,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
  ]

  return NextResponse.json({ proposals })
}
