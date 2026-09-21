'use client'
import { createContext, useContext } from 'react'
import { HEADER_DEFAULTS, FOOTER_DEFAULTS } from '@/lib/siteSettings'
import type { HeaderSettings, FooterSettings } from '@/lib/siteSettings'

type SiteSettings = { header: HeaderSettings; footer: FooterSettings }

const SiteSettingsContext = createContext<SiteSettings>({ header: HEADER_DEFAULTS, footer: FOOTER_DEFAULTS })

// Settings are loaded on the server in the root layout, so Nav and Footer render the
// real logo in the initial HTML instead of flashing the default logo first.
export function SiteSettingsProvider({ header, footer, children }: SiteSettings & { children: React.ReactNode }) {
  return <SiteSettingsContext.Provider value={{ header, footer }}>{children}</SiteSettingsContext.Provider>
}

export const useSiteSettings = () => useContext(SiteSettingsContext)
