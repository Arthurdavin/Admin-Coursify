import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  
  // 1. Get the token specifically
  const cookieStore = await cookies()
  const token = cookieStore.get('authToken') // Ensure this matches your login cookie name

  if (!token) {
    console.error('Missing authToken in cookies')
    return NextResponse.json({ error: 'Unauthorized: No token found' }, { status: 401 })
  }

  // 2. Prepare Pagination (Next.js 1-based -> Spring 0-based)
  const page = Math.max(0, Number(searchParams.get('page') || 1) - 1)
  const size = searchParams.get('size') || '12'
  const keyword = searchParams.get('keyword') || ''

  // 3. Construct Backend URL
  const backendUrl = new URL(`${process.env.API_URL}/api/admin/users/teachers`)
  backendUrl.searchParams.set('page', page.toString())
  backendUrl.searchParams.set('size', size)
  if (keyword) backendUrl.searchParams.set('keyword', keyword)

  console.log('--- Requesting Teachers ---')
  console.log('Target:', backendUrl.toString())

  try {
    const res = await fetch(backendUrl.toString(), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}`, // Pass token as Bearer
      },
      cache: 'no-store',
    })

    // 4. Handle Backend Errors
    if (!res.ok) {
      const errorBody = await res.text()
      console.error(`Backend ${res.status}:`, errorBody)
      return NextResponse.json(
        { error: 'Backend failed to provide teachers', details: errorBody }, 
        { status: res.status }
      )
    }

    // 5. Success
    const data = await res.json()
    return NextResponse.json(data)

  } catch (err: any) {
    console.error('Fetch Crash:', err.message)
    return NextResponse.json(
      { error: 'Internal Server Error', details: err.message }, 
      { status: 500 }
    )
  }
}