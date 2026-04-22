'use client'

import { useEffect } from 'react'
import { useAppDispatch } from './useRedux'
import { restoreAuth } from '../store/slices/authSlice'


export const useAuthInit = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    // Restore auth from localStorage on app load
    const token = localStorage.getItem('authToken')
    const userStr = localStorage.getItem('user')

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        dispatch(restoreAuth({ user, token }))
      } catch (error) {
        console.error('Failed to restore auth:', error)
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
      }
    }
  }, [dispatch])
}
