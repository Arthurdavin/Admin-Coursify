// import { logout } from '../store/slices/authSlice'
// import { useAppDispatch, useAppSelector } from './useRedux'


// export const useAuth = () => {
//   const dispatch = useAppDispatch()
//   const auth = useAppSelector((state) => state.auth)

//   const handleLogout = () => {
//     dispatch(logout())
//   }

//   return {
//     ...auth,
//     logout: handleLogout,
//   }
// }

import { useEffect } from 'react'
import { logout, setCredentials } from '../store/slices/authSlice'
import { useAppDispatch, useAppSelector } from './useRedux'
import { useGetProfileQuery } from '../store/services/authApi'

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const auth = useAppSelector((state) => state.auth)

  // ✅ Skip if user already loaded in store
  const { data: profile } = useGetProfileQuery(undefined, {
    skip: !auth.token || !!auth.user, // skip if already have user
  })

  useEffect(() => {
    if (profile && auth.token) {
      dispatch(setCredentials({
        user: profile,
        token: auth.token,
      }))
    }
  }, [profile])

  const handleLogout = () => {
    dispatch(logout())
  }

  return {
    ...auth,
    logout: handleLogout,
  }
}

// import { useEffect } from 'react'
// import { logout, setCredentials } from '../store/slices/authSlice'
// import { useAppDispatch, useAppSelector } from './useRedux'
// import { useGetProfileQuery } from '../store/services/authApi'

// export const useAuth = () => {
//   const dispatch = useAppDispatch()
//   const auth = useAppSelector((state) => state.auth)

//   // Fetch fresh profile from /api/users/me whenever a token exists
//   const { data: profile } = useGetProfileQuery(undefined, {
//     skip: !auth.token, // only runs if logged in
//   })

//   // Sync fresh profile data into the store
//   useEffect(() => {
//     if (profile && auth.token) {
//       dispatch(
//         setCredentials({
//           user: profile,
//           token: auth.token,
//         })
//       )
//     }
//   }, [profile])

//   const handleLogout = () => {
//     dispatch(logout())
//   }

//   return {
//     ...auth,
//     logout: handleLogout,
//   }
// }