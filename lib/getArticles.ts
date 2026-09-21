import { createClient } from '@/lib/supabase/client'
import type { Post } from '@/lib/types'

// Maps a Supabase article row to the Post shape used throughout the app
export function toPost(a: Record<string, unknown>, index: number): Post {
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

export async function getArticles(): Promise<Post[]> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('articles')
      .select('id, title, slug, excerpt, cover_image, category, tags, published_at, read_time, is_featured')
      .eq('published', true)
      .order('published_at', { ascending: false })

    if (error || !data) return []
    return data.map((a, i) => toPost(a as Record<string, unknown>, i))
  } catch {
    return []
  }
}
