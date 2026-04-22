import { baseApi } from './baseApi'
import { Material, PaginatedResponse } from '@/src/types'

export interface CreateMaterialRequest {
  title: string
  description?: string
  courseId: string
  fileUrl: string
  fileType: string
  fileSize: number
}

export interface UpdateMaterialRequest extends Partial<CreateMaterialRequest> {}

export const materialsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMaterials: builder.query<
      PaginatedResponse<Material>,
      {
        page?: number
        pageSize?: number
        search?: string
        courseId?: string
      }
    >({
      query: (params) => {
        const queryParams = new URLSearchParams()
        if (params.page) queryParams.set('page', String(params.page))
        if (params.pageSize) queryParams.set('pageSize', String(params.pageSize))
        if (params.search) queryParams.set('search', params.search)
        if (params.courseId) queryParams.set('courseId', params.courseId)
        return `/materials?${queryParams.toString()}`
      },
      providesTags: ['Materials'],
    }),

    getMaterialById: builder.query<Material, string>({
      query: (id) => `/materials/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Materials', id }],
    }),

    createMaterial: builder.mutation<Material, CreateMaterialRequest>({
      query: (body) => ({
        url: '/materials',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Materials'],
    }),

    updateMaterial: builder.mutation<Material, { id: string; data: UpdateMaterialRequest }>({
      query: ({ id, data }) => ({
        url: `/materials/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Materials', id },
        'Materials',
      ],
    }),

    deleteMaterial: builder.mutation<void, string>({
      query: (id) => ({
        url: `/materials/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Materials'],
    }),
  }),
})

export const {
  useGetMaterialsQuery,
  useGetMaterialByIdQuery,
  useCreateMaterialMutation,
  useUpdateMaterialMutation,
  useDeleteMaterialMutation,
} = materialsApi
