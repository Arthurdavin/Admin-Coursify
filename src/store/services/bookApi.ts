import { baseApi } from './baseApi'
import type { Book, PaginatedResponse } from '@/src/types'

export interface CreateBookRequest {
  title: string
  description?: string
  file_url?: string
  thumbnail?: string
  category_ids?: number[]
}

export interface UpdateBookRequest extends Partial<CreateBookRequest> {}

export const booksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET /api/admin/books
    getBooks: builder.query<
      PaginatedResponse<Book>,
      { page?: number; pageSize?: number; search?: string }
    >({
      query: ({ page = 1, pageSize = 12, search } = {}) => ({
        url: '/admin/books',
        params: {
          page: page - 1,   // uiSlice is 1-indexed, Spring expects 0-indexed
          size: pageSize,
          sort: 'createdAt,desc',
          ...(search?.trim() && { keyword: search }),
        },
      }),
      transformResponse: (raw: any): PaginatedResponse<Book> => ({
        data:          raw.content       ?? [],
        totalPages:    raw.totalPages    ?? 0,
        totalElements: raw.totalElements ?? 0,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Books' as const, id })),
              { type: 'Books' as const, id: 'LIST' },
            ]
          : [{ type: 'Books' as const, id: 'LIST' }],
    }),

    // GET /api/admin/books/:id
    getBookById: builder.query<Book, number>({
      query: (id) => `/admin/books/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'Books' as const, id }],
    }),

    // POST /api/admin/books
    createBook: builder.mutation<Book, CreateBookRequest>({
      query: (body) => ({
        url: '/admin/books',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Books' as const, id: 'LIST' }],
    }),

    // PATCH /api/admin/books/:id
    updateBook: builder.mutation<Book, { id: number; data: UpdateBookRequest }>({
      query: ({ id, data }) => ({
        url: `/admin/books/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: 'Books' as const, id },
        { type: 'Books' as const, id: 'LIST' },
      ],
    }),

    // DELETE /api/admin/books/:id
    deleteBook: builder.mutation<void, number>({
      query: (id) => ({
        url: `/admin/books/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_r, _e, id) => [
        { type: 'Books' as const, id },
        { type: 'Books' as const, id: 'LIST' },
      ],
    }),

  }),
})

export const {
  useGetBooksQuery,
  useGetBookByIdQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
} = booksApi