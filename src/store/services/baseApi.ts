import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../store'

const baseQuery = fetchBaseQuery({
  baseUrl: '/api', // ✅ remove env var, proxy handles the real URL
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery,
  tagTypes: [
    'Courses',
    'Students',
    'Teachers',
    'Categories',
    'Enrollments',
    'Materials',
    'Dashboard',
    'Books'
  ],
  endpoints: () => ({}),
})
