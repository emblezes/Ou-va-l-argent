import { NextRequest, NextResponse } from 'next/server'

const IDP_API = process.env.IDP_API_URL || 'http://localhost:8001'

/**
 * Proxy requests to the IDP FastAPI backend.
 * Allows the frontend to call /api/intelligence/* and have it forwarded.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path') || 'stats'

  // Remove the 'path' param and forward the rest
  searchParams.delete('path')
  const queryString = searchParams.toString()
  const url = `${IDP_API}/api/intelligence/${path}${queryString ? `?${queryString}` : ''}`

  try {
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 60 }, // Cache for 60s
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `IDP API returned ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'IDP backend not available. Start it with: cd intelligence && python api/routes.py' },
      { status: 503 }
    )
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const path = searchParams.get('path') || 'chat'
  const body = await request.json()

  const url = `${IDP_API}/api/intelligence/${path}`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json(
      { error: 'IDP backend not available' },
      { status: 503 }
    )
  }
}
