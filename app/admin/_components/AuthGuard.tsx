'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/src/hooks/useRedux'
import { restoreAuth } from '@/src/store/slices/authSlice'
import { Loader2 } from 'lucide-react'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { token, user } = useAppSelector((state) => state.auth)
  const [isRestored, setIsRestored] = useState(false)

  useEffect(() => {
  const storedToken = localStorage.getItem('authToken')
  const storedUser = localStorage.getItem('user')

  // Guard against literal "undefined" string or missing values
  if (storedToken && storedUser && storedUser !== 'undefined') {
    let parsedUser
    try {
      parsedUser = JSON.parse(storedUser)
    } catch (e) {
      // Corrupt data — clear and redirect
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      router.replace('/login')
      return
    }

    if (!parsedUser || parsedUser.role !== 'ADMIN') {
      router.replace('/unauthorized')
      return
    }

    dispatch(restoreAuth({ token: storedToken, user: parsedUser }))
    setIsRestored(true)
  } else {
    // Clean up any bad values before redirecting
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    router.replace('/login')
  }
}, [])

  useEffect(() => {
    if (isRestored && !token) router.replace('/login')
    if (isRestored && user && user.role !== 'ADMIN') router.replace('/unauthorized')
  }, [token, user, isRestored])

  if (!isRestored) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return <>{children}</>
}