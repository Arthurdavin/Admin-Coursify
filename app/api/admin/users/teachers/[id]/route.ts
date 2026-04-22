// import { NextRequest, NextResponse } from 'next/server'
// import { cookies } from 'next/headers'

// export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
//   const body = await req.json()
//   const res = await fetch(`${process.env.API_URL}/api/admin/teachers/${params.id}`, {
//     method: 'PATCH',
//     headers: {
//       'Content-Type': 'application/json',
//       Cookie: cookies().toString(),
//     },
//     body: JSON.stringify(body),
//   })
//   return NextResponse.json(await res.json(), { status: res.status })
// }

// export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
//   const res = await fetch(`${process.env.API_URL}/api/admin/users/${params.id}`, {
//     method: 'DELETE',
//     headers: { Cookie: cookies().toString() },
//   })
//   if (res.status === 204) return new NextResponse(null, { status: 204 })
//   return NextResponse.json(await res.json(), { status: res.status })
// }

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function PATCH(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> } // Fix: Promise
) {
  try {
    const { id } = await params // Fix: Await params
    const cookieStore = await cookies() // Fix: Await cookies
    const body = await req.json()

    const res = await fetch(`${process.env.API_URL}/api/admin/teachers/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieStore.toString(),
      },
      body: JSON.stringify(body),
    })

    const data = await res.json().catch(() => ({}))
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update teacher' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest, 
  { params }: { params: Promise<{ id: string }> } // Fix: Promise
) {
  try {
    const { id } = await params // Fix: Await params
    const cookieStore = await cookies() // Fix: Await cookies

    const res = await fetch(`${process.env.API_URL}/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: { 'Cookie': cookieStore.toString() },
    })

    if (res.status === 204) return new NextResponse(null, { status: 204 })

    const data = await res.json().catch(() => ({}))
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}