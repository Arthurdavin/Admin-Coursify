// import { User } from '../slices/authSlice'
// import { baseApi } from './baseApi'


// export interface LoginRequest {
//   email: string
//   password: string
// }

// export interface LoginResponse {
//   user: User
//   token: string
// }

// export const authApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     login: builder.mutation<LoginResponse, LoginRequest>({
//       query: (credentials) => ({
//         url: '/auth/login',
//         method: 'POST',
//         body: credentials,
//       }),
//     }),
//     logout: builder.mutation<void, void>({
//       query: () => ({
//         url: '/auth/logout',
//         method: 'POST',
//       }),
//     }),
//     getProfile: builder.query<User, void>({
//       query: () => '/auth/profile',
//     }),
//   }),
// })

// export const { useLoginMutation, useLogoutMutation, useGetProfileQuery } =
//   authApi


import { User } from '../slices/authSlice'
import { baseApi } from './baseApi'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),
    getProfile: builder.query<User, void>({
      query: () => '/users/me', // ✅ fixed from '/auth/profile'
    }),
  }),
})

export const { useLoginMutation, useLogoutMutation, useGetProfileQuery } = authApi