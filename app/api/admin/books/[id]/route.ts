// import { NextRequest, NextResponse } from 'next/server'

// const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:8080'

// export async function GET(
//   request: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params
//     const response = await fetch(`${BACKEND_URL}/books/${id}`, {
//       method: 'GET',
//       headers: { 'Content-Type': 'application/json' },
//     })

//     if (!response.ok) {
//       if (response.status === 404) return NextResponse.json({ error: 'Book not found' }, { status: 404 })
//       throw new Error(`Backend returned ${response.status}`)
//     }

//     const data = await response.json()
//     return NextResponse.json(data)
//   } catch (error) {
//     console.error('[API Routes] GET /books/[id] error:', error)
//     return NextResponse.json({ error: 'Failed to fetch book' }, { status: 500 })
//   }
// }

// export async function PUT(
//   request: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params
//     const body = await request.json()
//     const response = await fetch(`${BACKEND_URL}/books/${id}`, {
//       method: 'PUT',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(body),
//     })

//     if (!response.ok) {
//       if (response.status === 404) return NextResponse.json({ error: 'Book not found' }, { status: 404 })
//       throw new Error(`Backend returned ${response.status}`)
//     }

//     const data = await response.json()
//     return NextResponse.json(data)
//   } catch (error) {
//     console.error('[API Routes] PUT /books/[id] error:', error)
//     return NextResponse.json({ error: 'Failed to update book' }, { status: 500 })
//   }
// }

// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params
//     const response = await fetch(`${BACKEND_URL}/books/${id}`, {
//       method: 'DELETE',
//       headers: { 'Content-Type': 'application/json' },
//     })

//     if (!response.ok) {
//       if (response.status === 404) return NextResponse.json({ error: 'Book not found' }, { status: 404 })
//       throw new Error(`Backend returned ${response.status}`)
//     }

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error('[API Routes] DELETE /books/[id] error:', error)
//     return NextResponse.json({ error: 'Failed to delete book' }, { status: 500 })
//   }
// }


import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:8080'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const response = await fetch(`${BACKEND_URL}/books/${id}`)
    if (!response.ok) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(await response.json())
  } catch (e) { return NextResponse.json({ error: 'Error' }, { status: 500 }) }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const response = await fetch(`${BACKEND_URL}/books/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return NextResponse.json(await response.json())
  } catch (e) { return NextResponse.json({ error: 'Error' }, { status: 500 }) }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const response = await fetch(`${BACKEND_URL}/books/${id}`, { method: 'DELETE' })
    if (!response.ok) return NextResponse.json({ error: 'Error' }, { status: response.status })
    return NextResponse.json({ success: true })
  } catch (e) { return NextResponse.json({ error: 'Error' }, { status: 500 }) }
}