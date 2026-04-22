import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // 1. params is now a Promise
) {
  try {
    // 2. Await both params and cookies (Next.js 15 requirement)
    const { id } = await params
    const cookieStore = await cookies()
    
    const res = await fetch(`${process.env.API_URL}/api/admin/courses/${id}`, {
      method: 'DELETE',
      headers: { 
        'Cookie': cookieStore.toString(),
        'Content-Type': 'application/json' 
      },
    })

    if (res.status === 204) {
      return new NextResponse(null, { status: 204 })
    }

    const data = await res.json().catch(() => ({}))
    return NextResponse.json(data, { status: res.status })

  } catch (error) {
    console.error('[DELETE Course Error]:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}