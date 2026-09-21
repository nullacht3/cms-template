import { createClient } from '@supabase/supabase-js'
import { HEADER_DEFAULTS, FOOTER_DEFAULTS } from '@/lib/siteSettings'
import type { HeaderSettings, FooterSettings } from '@/lib/siteSettings'

// Server-side counterpart to getHeaderSettings/getFooterSettings (no cookies needed, public data)
export async function getSiteSettingsServer(): Promise<{ header: HeaderSettings; footer: FooterSettings }> {
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    const { data } = await supabase.from('site_settings').select('key, value').in('key', ['header', 'footer'])
    const byKey = Object.fromEntries((data || []).map((r) => [r.key, r.value]))
    return {
      header: { ...HEADER_DEFAULTS, ...(byKey.header as Partial<HeaderSettings>), nav_items: HEADER_DEFAULTS.nav_items },
      footer: { ...FOOTER_DEFAULTS, ...(byKey.footer as Partial<FooterSettings>) },
    }
  } catch {
    return { header: HEADER_DEFAULTS, footer: FOOTER_DEFAULTS }
  }
}
