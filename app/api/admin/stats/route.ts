// app/api/admin/stats/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('authToken')  // ✅ correct name

  if (!token) {
    return NextResponse.json({ error: 'No token found' }, { status: 401 })
  }

  try {
    const res = await fetch(`${process.env.API_URL}/api/admin/stats`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.value}`,
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      const body = await res.text()
      console.log('Backend error:', body)
      return NextResponse.json({ error: 'Failed to fetch stats' }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)

  } catch (err) {
    console.error('Fetch error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}