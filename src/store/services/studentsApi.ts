import { baseApi } from './baseApi'
import { Student, PaginatedResponse } from '@/src/types'

export interface CreateStudentRequest {
  email: string
  firstName: string // Matches your Java UserResponse/DTO
  lastName: string
  status?: 'active' | 'inactive'
}

export interface UpdateStudentRequest extends Partial<CreateStudentRequest> {}

export const studentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query<
      PaginatedResponse<Student>,
      {
        page?: number
        pageSize?: number
        search?: string // This will map to 'keyword' in our Route Handler
      }
    >({
      query: ({ page = 1, pageSize = 10, search }) => ({
        // MUST match the folder: app/api/admin/users/students/route.ts
        url: '/admin/users/students', 
        params: {
          page: page - 1,           // 👈 UI is 1-indexed, Spring Boot is 0-indexed
          size: pageSize,
          ...(search && { keyword: search }),
        },
      }),
      // This helps transform the Spring Boot Page object to your UI shape
      transformResponse: (raw: any): PaginatedResponse<Student> => ({
        data: raw.content || [],
        totalPages: raw.totalPages || 0,
        totalElements: raw.totalElements || 0,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Students' as const, id })),
              { type: 'Students', id: 'LIST' },
            ]
          : [{ type: 'Students', id: 'LIST' }],
    }),

    deleteStudent: builder.mutation<void, number | string>({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Students', id: 'LIST' }],
    }),

    updateStudent: builder.mutation<Student, { id: number; data: UpdateStudentRequest }>({
      query: ({ id, data }) => ({
        url: `/admin/users/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Students', id },
        { type: 'Students', id: 'LIST' },
      ],
    }),

    createStudent: builder.mutation<Student, CreateStudentRequest>({
      query: (data) => ({
        url: '/admin/users/students',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Students', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetStudentsQuery,
  useDeleteStudentMutation,
  useUpdateStudentMutation,
  useCreateStudentMutation,
} = studentsApi