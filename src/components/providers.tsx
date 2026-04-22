'use client'

import React, { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'next-themes'

import { AuthInitializer } from './auth/AuthInitializer'
import { store } from '../store/store'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthInitializer />
        {children}
      </ThemeProvider>
    </Provider>
  )
}
