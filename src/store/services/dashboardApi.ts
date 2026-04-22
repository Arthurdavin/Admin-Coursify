// src/store/service/dashboardApi.ts
// import { baseApi } from './baseApi'

// type AdminStats = {
//   totalUsers: number
//   totalStudents: number
//   totalTeachers: number
//   totalCourses: number
//   totalEnrollments: number
//   publishedCourses: number
// }

// export const dashboardApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     getAdminStats: builder.query<AdminStats, void>({
//       query: () => '/admin/stats',
//       providesTags: ['Dashboard'],
//     }),
//   }),
// })

// export const { useGetAdminStatsQuery } = dashboardApi


import { baseApi } from './baseApi'

type AdminStats = {
  totalUsers: number
  totalStudents: number
  totalTeachers: number
  totalCourses: number
  totalEnrollments: number
  publishedCourses: number
}

type EnrollmentTrend = {
  month: string
  enrollments: number
}

type CategoryDistribution = {
  name: string
  value: number
}

type TeacherStatus = {
  name: string
  value: number
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getAdminStats: builder.query<AdminStats, void>({
      query: () => '/admin/stats',
      providesTags: ['Dashboard'],
    }),

    getEnrollmentTrend: builder.query<EnrollmentTrend[], void>({
      query: () => '/admin/stats/enrollment-trend',
      providesTags: ['Dashboard'],
    }),

    getCourseDistribution: builder.query<CategoryDistribution[], void>({
      query: () => '/admin/stats/course-distribution',
      providesTags: ['Dashboard'],
    }),

    getTeacherStatus: builder.query<TeacherStatus[], void>({
      query: () => '/admin/stats/teacher-status',
      providesTags: ['Dashboard'],
    }),

  }),
})

export const {
  useGetAdminStatsQuery,
  useGetEnrollmentTrendQuery,
  useGetCourseDistributionQuery,
  useGetTeacherStatusQuery,
} = dashboardApi