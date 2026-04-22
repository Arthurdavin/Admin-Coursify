// import { NextRequest, NextResponse } from 'next/server'
// import { cookies } from 'next/headers'

// export async function GET(req: NextRequest) {
//   const { searchParams } = new URL(req.url)
//   const cookieStore = await cookies()
//   const token = cookieStore.get('authToken')

//   if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

//   // 1. Prepare Query Params for Spring
//   // Frontend sends 1, 2, 3... Spring wants 0, 1, 2...
//   const page = Math.max(0, Number(searchParams.get('page') || 1) - 1)
//   const size = searchParams.get('size') || '12'
//   const keyword = searchParams.get('keyword') || ''

//   const backendUrl = new URL(`${process.env.API_URL}/api/admin/courses`)
//   backendUrl.searchParams.set('page', page.toString())
//   backendUrl.searchParams.set('size', size)
//   if (keyword) backendUrl.searchParams.set('keyword', keyword)

//   try {
//     const res = await fetch(backendUrl.toString(), {
//       headers: {
//         'Authorization': `Bearer ${token.value}`,
//         'Content-Type': 'application/json'
//       },
//       cache: 'no-store'
//     })

//     if (!res.ok) return NextResponse.json({ error: 'Backend Error' }, { status: res.status })

//     const data = await res.json()
//     return NextResponse.json(data)
//   } catch (err: any) {
//     return NextResponse.json({ error: err.message }, { status: 500 })
//   }
// }

// // DELETE Handler for /api/admin/courses/[id]/route.ts
// // Match your: @DeleteMapping("/courses/{id}")
// export async function DELETE(
//   req: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   const cookieStore = await cookies()
//   const token = cookieStore.get('authToken')
  
//   const res = await fetch(`${process.env.API_URL}/api/admin/courses/${params.id}`, {
//     method: 'DELETE',
//     headers: { 'Authorization': `Bearer ${token?.value}` }
//   })

//   return new NextResponse(null, { status: res.status })
// }


import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const cookieStore = await cookies()
  const token = cookieStore.get('authToken')

  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const page = Math.max(0, Number(searchParams.get('page') || 1) - 1)
  const size = searchParams.get('size') || '12'
  const keyword = searchParams.get('keyword') || ''

  const backendUrl = new URL(`${process.env.API_URL}/api/admin/courses`)
  backendUrl.searchParams.set('page', page.toString())
  backendUrl.searchParams.set('size', size)
  if (keyword) backendUrl.searchParams.set('keyword', keyword)

  try {
    const res = await fetch(backendUrl.toString(), {
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    })
    if (!res.ok) return NextResponse.json({ error: 'Backend Error' }, { status: res.status })
    return NextResponse.json(await res.json())
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}