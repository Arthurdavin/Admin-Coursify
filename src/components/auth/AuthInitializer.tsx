'use client'

import { useAuthInit } from "@/src/hooks/useAuthInit"


export function AuthInitializer() {
  useAuthInit()
  return null
}
