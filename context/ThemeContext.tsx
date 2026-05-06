'use client'
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { THEMES } from '@/lib/themes'
import type { Theme } from '@/lib/types'

type ThemeContextType = { t: Theme; variant: string; setVariant: (v: string) => void }
const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [variant, setVariantState] = useState('beige')
  const t = THEMES[variant] || THEMES.beige

  // Load saved theme on first render
  useEffect(() => {
    const saved = localStorage.getItem('daesthet-theme')
    if (saved && THEMES[saved]) setVariantState(saved)
  }, [])

  useEffect(() => {
    document.body.style.background = t.bg
    document.body.style.color = t.text
  }, [t])

  const setVariant = (v: string) => {
    setVariantState(v)
    localStorage.setItem('daesthet-theme', v)
  }

  return <ThemeContext.Provider value={{ t, variant, setVariant }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
