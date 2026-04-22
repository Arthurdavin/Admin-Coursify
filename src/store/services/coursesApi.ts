// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import type { Course } from "@/src/types";

// interface CoursesResponse {
//   data: Course[];
//   totalPages: number;
//   totalElements: number;
// }

// interface CoursesQueryParams {
//   page?: number;
//   pageSize?: number;
//   search?: string;
// }

// export interface CreateCoursePayload {
//   title: string;
//   description: string;
//   categoryId: number;
//   thumbnail?: string;

//   price: number;
//   isPublished: boolean;
//   tags: string[];
//   lessons: {
//     title: string;
//     description: string;
//     videoUrl: string;
//   }[];
// }

// export interface CreateCourseRequest {
//   title: string
//   description: string
//   categoryId: number       // ✅ camelCase — Java deserializes JSON camelCase by default
//   thumbnail?: string
//   price: number
//   isPublished?: boolean
//   tags?: string[]
//   lessons?: {
//     title: string
//     description: string
//     videoUrl: string       // ✅ camelCase
//   }[]
// }

// export const coursesApi = createApi({
//   reducerPath: "coursesApi",
//   baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
//   tagTypes: ["Course"],
//   endpoints: (builder) => ({
//     getCourses: builder.query<CoursesResponse, CoursesQueryParams>({
//       query: ({ page = 0, pageSize = 12, search }) => ({
//         url: "/admin/courses",
//         params: {
//           page: page - 1, // 👈 fix: UI 1-indexed → Spring Boot 0-indexed
//           size: pageSize,
//           ...(search?.trim() && { keyword: search }),
//         },
//       }),
//       transformResponse: (raw: any): CoursesResponse => ({
//         data: raw.content,
//         totalPages: raw.totalPages,
//         totalElements: raw.totalElements,
//       }),
//       providesTags: (result) =>
//         result
//           ? [
//               ...result.data.map(({ id }) => ({ type: "Course" as const, id })),
//               { type: "Course", id: "LIST" },
//             ]
//           : [{ type: "Course", id: "LIST" }],
//     }),

//     deleteCourse: builder.mutation<void, number>({
//       query: (id) => ({ url: `/admin/courses/${id}`, method: "DELETE" }),
//       invalidatesTags: [{ type: "Course", id: "LIST" }],
//     }),

//     createCourse: builder.mutation<Course, CreateCoursePayload>({
//       query: (body) => ({
//         url: "/courses",
//         method: "POST",
//         body,
//       }),
//       invalidatesTags: ["Course"],
//     }),
//     updateCourse: builder.mutation<
//       Course,
//       { id: number; body: Partial<CreateCoursePayload> }
//     >({
//       query: ({ id, body }) => ({
//         url: `/courses/${id}`,
//         method: "PATCH",
//         body,
//       }),
//       invalidatesTags: (_r, _e, { id }) => [{ type: "Course", id }],
//     }),
//   }),
// });

// export const {
//   useGetCoursesQuery,
//   useDeleteCourseMutation,
//   useCreateCourseMutation,
//   useUpdateCourseMutation,
// } = coursesApi;


import { baseApi } from './baseApi'
import type { Course, PaginatedResponse } from '@/src/types'

export interface CreateCourseRequest {
  title: string
  description: string
  categoryId: number
  thumbnail?: string
  price: number
  isPublished?: boolean
  tags?: string[]
  lessons?: {
    title: string
    description: string
    videoUrl: string
  }[]
}

export interface UpdateCourseRequest extends Partial<CreateCourseRequest> {}

export const coursesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET /api/admin/courses — admin sees ALL courses (published + draft)
    getCourses: builder.query<
      PaginatedResponse<Course>,
      { page?: number; pageSize?: number; search?: string }
    >({
      query: ({ page = 0, pageSize = 12, search } = {}) => ({
        url: '/admin/courses',
        params: {
          page,
          size: pageSize,
          ...(search?.trim() && { keyword: search }),
        },
      }),
      transformResponse: (raw: any): PaginatedResponse<Course> => ({
        data:          raw.content       ?? [],
        totalPages:    raw.totalPages    ?? 0,
        totalElements: raw.totalElements ?? 0,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Courses' as const, id })),
              { type: 'Courses' as const, id: 'LIST' },
            ]
          : [{ type: 'Courses' as const, id: 'LIST' }],
    }),

    // GET /api/courses/:id
    getCourseById: builder.query<Course, number>({
      query: (id) => `/courses/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Courses' as const, id }],
    }),

    // GET /api/courses/my-courses — teacher's own courses
    getMyCourses: builder.query<Course[], void>({
      query: () => '/courses/my-courses',
      providesTags: [{ type: 'Courses' as const, id: 'LIST' }],
    }),

    // POST /api/courses — TEACHER or ADMIN
    createCourse: builder.mutation<Course, CreateCourseRequest>({
      query: (body) => ({
        url: '/courses',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Courses' as const, id: 'LIST' }],
    }),

    // PATCH /api/courses/:id — TEACHER or ADMIN
    updateCourse: builder.mutation<Course, { id: number; data: UpdateCourseRequest }>({
      query: ({ id, data }) => ({
        url: `/courses/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: 'Courses' as const, id },
        { type: 'Courses' as const, id: 'LIST' },
      ],
    }),

    // PATCH /api/courses/:id/publish — TEACHER or ADMIN
    publishCourse: builder.mutation<Course, number>({
      query: (id) => ({
        url: `/courses/${id}/publish`,
        method: 'PATCH',
      }),
      invalidatesTags: (_r, _e, id) => [
        { type: 'Courses' as const, id },
        { type: 'Courses' as const, id: 'LIST' },
      ],
    }),

    // DELETE /api/admin/courses/:id — ADMIN only (AdminController)
    deleteCourse: builder.mutation<void, number>({
      query: (id) => ({
        url: `/admin/courses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_r, _e, id) => [
        { type: 'Courses' as const, id },
        { type: 'Courses' as const, id: 'LIST' },
      ],
    }),

  }),
})

export const {
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useGetMyCoursesQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  usePublishCourseMutation,
  useDeleteCourseMutation,
} = coursesApi