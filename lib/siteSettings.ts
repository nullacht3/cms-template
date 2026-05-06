import { createClient } from './supabase/client'

export type NavItem = { label: string; href: string }

export type HeaderSettings = {
  site_name: string
  logo_url: string
  tagline: string
  nav_items: NavItem[]
}

export type FooterSettings = {
  copyright: string
  tagline: string
  legal_links: NavItem[]
}

export const HEADER_DEFAULTS: HeaderSettings = {
  site_name: 'Der Ästhet',
  logo_url: '',
  tagline: 'Das Magazin für ästhetische Medizin',
  nav_items: [
    { label: 'Blog', href: '/' },
    { label: 'Kategorien', href: '/kategorien' },
    { label: 'Kontakt', href: '/kontakt' },
  ],
}

export const FOOTER_DEFAULTS: FooterSettings = {
  copyright: '© 2026 Der Ästhet',
  tagline: 'Das Magazin für ästhetische Medizin — präzise, unabhängig, anspruchsvoll.',
  legal_links: [
    { label: 'Impressum', href: '/impressum' },
    { label: 'Datenschutz', href: '/datenschutz' },
    { label: 'Kontakt', href: '/kontakt' },
  ],
}

export async function getHeaderSettings(): Promise<HeaderSettings> {
  try {
    const supabase = createClient()
    const { data } = await supabase.from('site_settings').select('value').eq('key', 'header').single()
    if (data?.value) return { ...HEADER_DEFAULTS, ...(data.value as Partial<HeaderSettings>) }
  } catch { /* use defaults */ }
  return HEADER_DEFAULTS
}

export async function getFooterSettings(): Promise<FooterSettings> {
  try {
    const supabase = createClient()
    const { data } = await supabase.from('site_settings').select('value').eq('key', 'footer').single()
    if (data?.value) return { ...FOOTER_DEFAULTS, ...(data.value as Partial<FooterSettings>) }
  } catch { /* use defaults */ }
  return FOOTER_DEFAULTS
}

export async function saveSetting(key: string, value: unknown): Promise<void> {
  const supabase = createClient()
  await supabase.from('site_settings').upsert({ key, value, updated_at: new Date().toISOString() })
}
