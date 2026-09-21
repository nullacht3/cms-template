import type { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

const BASE_URL = 'https://deraesthet.de'

// Neue Artikel erscheinen spätestens nach einer Stunde in der Sitemap
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/kategorien`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE_URL}/kontakt`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE_URL}/impressum`, changeFrequency: 'yearly', priority: 0.1 },
    { url: `${BASE_URL}/datenschutz`, changeFrequency: 'yearly', priority: 0.1 },
  ]

  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    const { data } = await supabase
      .from('articles')
      .select('slug, updated_at, published_at')
      .eq('published', true)
      .order('published_at', { ascending: false })

    const articles: MetadataRoute.Sitemap = (data || []).map((a) => ({
      url: `${BASE_URL}/${a.slug}`,
      lastModified: a.updated_at || a.published_at || undefined,
      changeFrequency: 'monthly',
      priority: 0.8,
    }))
    return [...staticPages, ...articles]
  } catch {
    return staticPages
  }
}
