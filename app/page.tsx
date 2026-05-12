import { createClient } from '@/lib/supabase/server'
import { HomeClient } from '@/components/HomeClient'
import { HOMEPAGE_DEFAULTS, type HomepageSettings } from '@/lib/siteSettings'
import { POSTS } from '@/lib/themes'
import type { Post } from '@/lib/types'

function toPost(a: Record<string, unknown>, index: number): Post {
  const tag = (a.tags as string[])?.[0] || 'Artikel'
  const type: Post['type'] = ['Interview'].includes(tag)
    ? 'interview'
    : ['Vergleich', 'Kosten', 'Mythen', 'Liste'].includes(tag)
    ? 'liste'
    : 'artikel'

  const publishedAt = a.published_at as string | null
  const date = publishedAt
    ? new Date(publishedAt).toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })
    : ''

  return {
    id: index + 1,
    category: (a.category as string) || '',
    tag,
    title: a.title as string,
    excerpt: (a.excerpt as string) || '',
    readTime: (a.read_time as string) || '5 Min.',
    date,
    featured: (a.is_featured as boolean) || false,
    type,
    photo: (a.cover_image as string) || '',
    slug: a.slug as string,
  }
}

export default async function HomePage() {
  const supabase = await createClient()

  // Artikel laden
  let posts: Post[] = POSTS
  try {
    const { data } = await supabase
      .from('articles')
      .select('id, title, slug, excerpt, cover_image, category, tags, published_at, read_time, is_featured')
      .eq('published', true)
      .order('published_at', { ascending: false })
    if (data && data.length > 0) {
      posts = data.map((a, i) => toPost(a as Record<string, unknown>, i))
    }
  } catch { /* Fallback zu POSTS */ }

  // Hero-Einstellungen laden
  let hero: HomepageSettings = HOMEPAGE_DEFAULTS
  try {
    const { data } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'homepage')
      .single()
    if (data?.value) {
      hero = { ...HOMEPAGE_DEFAULTS, ...(data.value as Partial<HomepageSettings>) }
    }
  } catch { /* Fallback zu HOMEPAGE_DEFAULTS */ }

  return <HomeClient posts={posts} hero={hero} />
}
