import { baseApi } from './baseApi'
import { Enrollment, PaginatedResponse } from '@/src/types'

export interface CreateEnrollmentRequest {
  studentId: string
  courseId: string
  status?: 'active' | 'completed' | 'dropped'
}

export interface UpdateEnrollmentRequest extends Partial<CreateEnrollmentRequest> {}

export const enrollmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getEnrollments: builder.query<
      PaginatedResponse<Enrollment>,
      {
        page?: number
        pageSize?: number
        search?: string
        status?: string
        studentId?: string
        courseId?: string
      }
    >({
      query: (params) => {
        const queryParams = new URLSearchParams()
        if (params.page) queryParams.set('page', String(params.page))
        if (params.pageSize) queryParams.set('pageSize', String(params.pageSize))
        if (params.search) queryParams.set('search', params.search)
        if (params.status) queryParams.set('status', params.status)
        if (params.studentId) queryParams.set('studentId', params.studentId)
        if (params.courseId) queryParams.set('courseId', params.courseId)
        return `/enrollments?${queryParams.toString()}`
      },
      providesTags: ['Enrollments'],
    }),

    getEnrollmentById: builder.query<Enrollment, string>({
      query: (id) => `/enrollments/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Enrollments', id }],
    }),

    createEnrollment: builder.mutation<Enrollment, CreateEnrollmentRequest>({
      query: (body) => ({
        url: '/enrollments',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Enrollments', 'Students'],
    }),

    updateEnrollment: builder.mutation<Enrollment, { id: string; data: UpdateEnrollmentRequest }>({
      query: ({ id, data }) => ({
        url: `/enrollments/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Enrollments', id },
        'Enrollments',
      ],
    }),

    deleteEnrollment: builder.mutation<void, string>({
      query: (id) => ({
        url: `/enrollments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Enrollments', 'Students'],
    }),
  }),
})

export const {
  useGetEnrollmentsQuery,
  useGetEnrollmentByIdQuery,
  useCreateEnrollmentMutation,
  useUpdateEnrollmentMutation,
  useDeleteEnrollmentMutation,
} = enrollmentsApi
