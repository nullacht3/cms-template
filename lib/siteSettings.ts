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
    { label: 'Treatments', href: '/kategorien?cat=treatments' },
    { label: 'Beauty Trends', href: '/kategorien?cat=trends' },
    { label: 'Wissen & Forschung', href: '/kategorien?cat=wissen' },
    { label: 'Sprechstunde', href: '/kategorien?cat=sprechstunde' },
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
    if (data?.value) {
      const stored = data.value as Partial<HeaderSettings>
      // nav_items always come from code so category changes deploy instantly
      return { ...HEADER_DEFAULTS, ...stored, nav_items: HEADER_DEFAULTS.nav_items }
    }
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

export type HomepageSettings = {
  hero_image: string
  hero_title: string
  hero_subtitle: string
  hero_tagline: string
  hero_description: string
  hero_button_text: string
  hero_button_url: string
}

export const HOMEPAGE_DEFAULTS: HomepageSettings = {
  hero_image: 'https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&w=1800&q=85',
  hero_title: 'Ästhetische Medizin',
  hero_subtitle: 'mit wissenschaftlichem Anspruch.',
  hero_tagline: 'Wissenschaft · Ästhetik · München',
  hero_description: 'Fundiertes Fachwissen, kuratierte Listen und Interviews für alle, die Ästhetik wirklich verstehen wollen.',
  hero_button_text: 'Alle Artikel →',
  hero_button_url: '/kategorien',
}

export type KontaktSettings = {
  heading: string
  intro_text: string
  author_photo: string
  author_name: string
  author_role: string
  email: string
  address_lines: string[]
  note: string
}

export const KONTAKT_DEFAULTS: KontaktSettings = {
  heading: 'Kontakt',
  intro_text: 'Fragen, Anregungen oder Kooperationsanfragen? Ich freue mich über Ihre Nachricht.',
  author_photo: '',
  author_name: 'Ronja Menzel',
  author_role: '',
  email: 'info@nullachtdrei.de',
  address_lines: ['Ronja Menzel', 'Einsteinstraße 129', '81675 München'],
  note: 'Diese Website ist kein medizinischer Anbieter. Für medizinische Fragen wenden Sie sich bitte an einen approbierten Arzt.',
}

export async function getKontaktSettings(): Promise<KontaktSettings> {
  try {
    const supabase = createClient()
    const { data } = await supabase.from('site_settings').select('value').eq('key', 'kontakt').single()
    if (data?.value) return { ...KONTAKT_DEFAULTS, ...(data.value as Partial<KontaktSettings>) }
  } catch { /* use defaults */ }
  return KONTAKT_DEFAULTS
}

export async function getHomepageSettings(): Promise<HomepageSettings> {
  try {
    const supabase = createClient()
    const { data } = await supabase.from('site_settings').select('value').eq('key', 'homepage').single()
    if (data?.value) return { ...HOMEPAGE_DEFAULTS, ...(data.value as Partial<HomepageSettings>) }
  } catch { /* use defaults */ }
  return HOMEPAGE_DEFAULTS
}

export async function saveSetting(key: string, value: unknown): Promise<void> {
  const supabase = createClient()
  await supabase.from('site_settings').upsert({ key, value, updated_at: new Date().toISOString() })
}
