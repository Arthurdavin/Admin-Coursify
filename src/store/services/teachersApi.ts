// import { baseApi } from './baseApi'
// import { Teacher, PaginatedResponse } from '@/src/types'

// export interface CreateTeacherRequest {
//   email: string
//   name: string
//   specialization?: string
//   status?: 'active' | 'inactive'
// }

// export interface UpdateTeacherRequest extends Partial<CreateTeacherRequest> {}

// export const teachersApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     getTeachers: builder.query<
//       PaginatedResponse<Teacher>,
//       {
//         page?: number
//         pageSize?: number
//         search?: string
//         status?: string
//       }
//     >({
//       query: (params) => {
//         const queryParams = new URLSearchParams()
//         if (params.page) queryParams.set('page', String(params.page))
//         if (params.pageSize) queryParams.set('pageSize', String(params.pageSize))
//         if (params.search) queryParams.set('search', params.search)
//         if (params.status) queryParams.set('status', params.status)
//         return `/teachers?${queryParams.toString()}`
//       },
//       providesTags: ['Teachers'],
//     }),

//     getTeacherById: builder.query<Teacher, string>({
//       query: (id) => `/teachers/${id}`,
//       providesTags: (_result, _error, id) => [{ type: 'Teachers', id }],
//     }),

//     createTeacher: builder.mutation<Teacher, CreateTeacherRequest>({
//       query: (body) => ({
//         url: '/teachers',
//         method: 'POST',
//         body,
//       }),
//       invalidatesTags: ['Teachers'],
//     }),

//     updateTeacher: builder.mutation<Teacher, { id: string; data: UpdateTeacherRequest }>({
//       query: ({ id, data }) => ({
//         url: `/teachers/${id}`,
//         method: 'PUT',
//         body: data,
//       }),
//       invalidatesTags: (_result, _error, { id }) => [
//         { type: 'Teachers', id },
//         'Teachers',
//       ],
//     }),

//     deleteTeacher: builder.mutation<void, string>({
//       query: (id) => ({
//         url: `/teachers/${id}`,
//         method: 'DELETE',
//       }),
//       invalidatesTags: ['Teachers'],
//     }),
//   }),
// })

// export const {
//   useGetTeachersQuery,
//   useGetTeacherByIdQuery,
//   useCreateTeacherMutation,
//   useUpdateTeacherMutation,
//   useDeleteTeacherMutation,
// } = teachersApi


// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
// import type { Teacher } from '@/src/types'


// interface TeachersResponse {
//   data: Teacher[]
//   totalPages: number
//   totalElements: number
// }

// interface TeachersQueryParams {
//   page?: number
//   pageSize?: number
//   search?: string
// }

// export interface CreateTeacherRequest {
//   username: string
//   email: string
//   firstName: string
//   lastName: string
// }

// export interface UpdateTeacherRequest {
//   username?: string
//   email?: string
//   firstName?: string
//   lastName?: string
// }

// export const teachersApi = createApi({
//   reducerPath: 'teachersApi',
//   baseQuery: fetchBaseQuery({ baseUrl: '/api' }), // Hits your Next.js Route Handlers
//   tagTypes: ['Teacher'],
//   endpoints: (builder) => ({
//     getTeachers: builder.query<TeachersResponse, TeachersQueryParams>({
//       query: ({ page = 1, pageSize = 12, search }) => ({
//         // This MUST match the folder path: app/api/admin/users/teachers/route.ts
//         url: '/admin/users/teachers', 
//         params: {
//           page: page - 1,           // 👈 UI 1-indexed → Spring Boot 0-indexed
//           size: pageSize,
//           ...(search && { keyword: search }),
//         },
//       }),
//       transformResponse: (raw: any): TeachersResponse => ({
//         data: raw.content || [],
//         totalPages: raw.totalPages || 0,
//         totalElements: raw.totalElements || 0,
//       }),
//       providesTags: (result) =>
//         result
//           ? [
//               ...result.data.map(({ id }) => ({ type: 'Teacher' as const, id })),
//               { type: 'Teacher', id: 'LIST' },
//             ]
//           : [{ type: 'Teacher', id: 'LIST' }],
//     }),

//     // Note: Ensure you have a POST handler in app/api/admin/users/teachers/route.ts
//     createTeacher: builder.mutation<Teacher, CreateTeacherRequest>({
//       query: (body) => ({
//         url: '/admin/users/teachers',
//         method: 'POST',
//         body,
//       }),
//       invalidatesTags: [{ type: 'Teacher', id: 'LIST' }],
//     }),

//     // Note: Ensure you have a PATCH/DELETE handler in app/api/admin/users/teachers/[id]/route.ts
//     updateTeacher: builder.mutation<Teacher, { id: number; body: UpdateTeacherRequest }>({
//       query: ({ id, body }) => ({
//         url: `/admin/users/teachers/${id}`,
//         method: 'PATCH',
//         body,
//       }),
//       invalidatesTags: (_result, _error, { id }) => [
//         { type: 'Teacher', id },
//         { type: 'Teacher', id: 'LIST' }
//       ],
//     }),

//     deleteTeacher: builder.mutation<void, number>({
//       query: (id) => ({ 
//         url: `/admin/users/teachers/${id}`, 
//         method: 'DELETE' 
//       }),
//       invalidatesTags: [{ type: 'Teacher', id: 'LIST' }],
//     }),
//   }),
// })

// export const {
//   useGetTeachersQuery,
//   useCreateTeacherMutation,
//   useUpdateTeacherMutation,
//   useDeleteTeacherMutation,
// } = teachersApi


import { baseApi } from './baseApi'
import type { Teacher, PaginatedResponse } from '@/src/types'

export interface CreateTeacherRequest {
  username: string
  email: string
  firstName: string
  lastName: string
}

export interface UpdateTeacherRequest {
  username?: string
  email?: string
  firstName?: string
  lastName?: string
}

export const teachersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET /api/admin/users/teachers
    getTeachers: builder.query<
      PaginatedResponse<Teacher>,
      { page?: number; pageSize?: number; search?: string }
    >({
      query: ({ page = 0, pageSize = 12, search } = {}) => ({
        url: '/admin/users/teachers',
        params: {
          page,
          size: pageSize,
          ...(search?.trim() && { keyword: search }),
        },
      }),
      transformResponse: (raw: any): PaginatedResponse<Teacher> => ({
        data:          raw.content       ?? [],
        totalPages:    raw.totalPages    ?? 0,
        totalElements: raw.totalElements ?? 0,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Teachers' as const, id })),
              { type: 'Teachers' as const, id: 'LIST' },
            ]
          : [{ type: 'Teachers' as const, id: 'LIST' }],
    }),

    // POST /api/admin/users/teachers
    createTeacher: builder.mutation<Teacher, CreateTeacherRequest>({
      query: (body) => ({
        url: '/admin/users/teachers',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Teachers' as const, id: 'LIST' }],
    }),

    // PATCH /api/admin/users/teachers/:id
    updateTeacher: builder.mutation<Teacher, { id: number; data: UpdateTeacherRequest }>({
      query: ({ id, data }) => ({
        url: `/admin/users/teachers/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: 'Teachers' as const, id },
        { type: 'Teachers' as const, id: 'LIST' },
      ],
    }),

    // DELETE /api/admin/users/:id — matches AdminController @DeleteMapping("/users/{id}")
    deleteTeacher: builder.mutation<void, number>({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_r, _e, id) => [
        { type: 'Teachers' as const, id },
        { type: 'Teachers' as const, id: 'LIST' },
      ],
    }),

  }),
})

export const {
  useGetTeachersQuery,
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation,
} = teachersApi