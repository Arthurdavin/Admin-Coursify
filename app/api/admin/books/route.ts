import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.API_URL || 'http://localhost:8080'

// ── Helper: forward Authorization header from the incoming request ────────────
function getAuthHeader(request: NextRequest): HeadersInit {
  const token = request.headers.get('authorization')
  return {
    'Content-Type': 'application/json',
    ...(token && { authorization: token }),
  }
}

// GET /api/admin/books?page=0&size=12&sort=createdAt,desc&keyword=...
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const params = new URLSearchParams()

    // Forward all supported Spring Pageable params
    if (searchParams.has('page'))    params.set('page',    searchParams.get('page')!)
    if (searchParams.has('size'))    params.set('size',    searchParams.get('size')!)
    if (searchParams.has('sort'))    params.set('sort',    searchParams.get('sort')!)
    if (searchParams.has('keyword')) params.set('keyword', searchParams.get('keyword')!)

    const response = await fetch(
      `${BACKEND_URL}/api/admin/books?${params.toString()}`,
      { headers: getAuthHeader(request) }
    )

    if (!response.ok) throw new Error(`Backend returned ${response.status}`)
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('[API Route] GET /admin/books error:', error)
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 })
  }
}

// POST /api/admin/books
// Body: { title, description, file_url, thumbnail, category_ids }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const response = await fetch(`${BACKEND_URL}/api/admin/books`, {
      method: 'POST',
      headers: getAuthHeader(request),
      body: JSON.stringify(body),
    })

    if (!response.ok) throw new Error(`Backend returned ${response.status}`)
    const data = await response.json()
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('[API Route] POST /admin/books error:', error)
    return NextResponse.json({ error: 'Failed to create book' }, { status: 500 })
  }
}