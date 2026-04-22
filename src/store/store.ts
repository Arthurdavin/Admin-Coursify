// import { configureStore } from '@reduxjs/toolkit'
// import authReducer from './slices/authSlice'
// import uiReducer from './slices/uiSlice'
// import { baseApi } from './services/baseApi'
// import { teachersApi } from './services/teachersApi'
// import { coursesApi } from './services/coursesApi'

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     ui: uiReducer,
//     [baseApi.reducerPath]: baseApi.reducer,
//     [teachersApi.reducerPath]: teachersApi.reducer,
//     [coursesApi.reducerPath]: coursesApi.reducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware()
//       .concat(
//         baseApi.middleware,
//         teachersApi.middleware,
//         coursesApi.middleware)
      
// })

// export type RootState = ReturnType<typeof store.getState>
// export type AppDispatch = typeof store.dispatch

import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import uiReducer from './slices/uiSlice'
import { baseApi } from './services/baseApi'

// These use injectEndpoints — importing them registers the endpoints.
// No separate reducer or middleware entry needed for any of them.
import './services/coursesApi'
import './services/teachersApi'
import './services/studentsApi'
import './services/categoriesApi'
import './services/bookApi'


export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch