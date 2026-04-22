// import { NextRequest, NextResponse } from 'next/server'
// import { cookies } from 'next/headers'

// export async function GET(req: NextRequest) {
//   const { searchParams } = new URL(req.url)
//   const cookieStore = await cookies()
//   const token = cookieStore.get('authToken')

//   if (!token) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//   }

//   // Convert 1-indexed (Frontend) to 0-indexed (Spring Boot)
//   const page = Math.max(0, Number(searchParams.get('page') || 1) - 1)
//   const size = searchParams.get('size') || '12'

//   const backendUrl = new URL(`${process.env.API_URL}/api/admin/users/students`)
//   backendUrl.searchParams.set('page', page.toString())
//   backendUrl.searchParams.set('size', size)
//   // No keyword search in your Java getAllStudents yet, 
//   // but if you add it later, you can set it here.

//   try {
//     const res = await fetch(backendUrl.toString(), {
//       headers: {
//         'Authorization': `Bearer ${token.value}`,
//         'Content-Type': 'application/json',
//       },
//       cache: 'no-store',
//     })

//     if (!res.ok) {
//       return NextResponse.json({ error: 'Failed to fetch students' }, { status: res.status })
//     }

//     const data = await res.json()
//     // Data will be the Spring Page object (content, totalPages, etc.)
//     return NextResponse.json(data)
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 })
//   }
// }


import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// ✅ MUST BE NAMED EXPORT "GET"
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const cookieStore = await cookies()
    const token = cookieStore.get('authToken')

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const page = Math.max(0, Number(searchParams.get('page') || 1) - 1)
    const size = searchParams.get('size') || '10'

    const backendUrl = new URL(`${process.env.API_URL}/api/admin/users/students`)
    backendUrl.searchParams.set('page', page.toString())
    backendUrl.searchParams.set('size', size)

    const res = await fetch(backendUrl.toString(), {
      headers: {
        'Authorization': `Bearer ${token.value}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      return NextResponse.json({ error: 'Backend error' }, { status: res.status })
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}