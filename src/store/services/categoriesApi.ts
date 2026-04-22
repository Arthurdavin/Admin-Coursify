import { baseApi } from './baseApi'
import { Category } from '@/src/types'

export interface CreateCategoryRequest {
  name: string
  description?: string
}

export interface UpdateCategoryRequest extends CreateCategoryRequest {}

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // ✅ Returns List<CategoryResponse> — no pagination, no Page wrapper
    getCategories: builder.query<Category[], void>({
      query: () => '/categories',
      transformResponse: (raw: Category[]) => raw,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Categories' as const, id })),
              { type: 'Categories' as const, id: 'LIST' },
            ]
          : [{ type: 'Categories' as const, id: 'LIST' }],
    }),

    getCategoryById: builder.query<Category, number>({
      query: (id) => `/categories/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Categories', id }],
    }),

    // ✅ POST /api/categories
    createCategory: builder.mutation<Category, CreateCategoryRequest>({
      query: (data) => ({
        url: '/categories',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Categories', id: 'LIST' }],
    }),

    // ✅ PUT not PATCH — matches @PutMapping("/{id}")
    updateCategory: builder.mutation<Category, { id: number; data: UpdateCategoryRequest }>({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Categories', id },
        { type: 'Categories', id: 'LIST' },
      ],
    }),

    // ✅ DELETE /api/categories/{id}
    deleteCategory: builder.mutation<void, number>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Categories', id },
        { type: 'Categories', id: 'LIST' },
      ],
    }),

  }),
})

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi