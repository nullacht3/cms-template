'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ArticleEditor } from '@/components/ArticleEditor'

export default function EditPage() {
  const { id } = useParams<{ id: string }>()
  const [initial, setInitial] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('articles')
        .select('title, slug, excerpt, content, cover_image, category, tags, read_time, is_featured, published, seo_title, meta_description')
        .eq('id', id)
        .single()
      if (error || !data) {
        setError('Artikel nicht gefunden.')
      } else {
        setInitial({
          title: data.title || '',
          slug: data.slug || '',
          excerpt: data.excerpt || '',
          content: data.content || '',
          cover_image: data.cover_image || '',
          category: data.category || '',
          tag: Array.isArray(data.tags) ? (data.tags[0] || '') : '',
          read_time: data.read_time || '5 Min.',
          is_featured: data.is_featured || false,
          published: data.published || false,
          seo_title: data.seo_title || '',
          meta_description: data.meta_description || '',
        })
      }
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return (
    <div style={{ padding: 40, color: '#8aa0b8', fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>Laden…</div>
  )
  if (error) return (
    <div style={{ padding: 40, color: '#c0392b', fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>{error}</div>
  )

  return <ArticleEditor id={id} initial={initial as Parameters<typeof ArticleEditor>[0]['initial']} />
}
