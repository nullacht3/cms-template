'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

type Article = {
  id: string; title: string; slug: string
  category: string | null; published: boolean
  published_at: string | null; is_featured: boolean
}

export default function AdminDashboard() {
  const router = useRouter()
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    const supabase = createClient()
    const { data } = await supabase
      .from('articles')
      .select('id, title, slug, category, published, published_at, is_featured')
      .order('published_at', { ascending: false, nullsFirst: false })
    setArticles(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function togglePublished(id: string, current: boolean) {
    const supabase = createClient()
    await supabase.from('articles').update({ published: !current, published_at: !current ? new Date().toISOString() : null }).eq('id', id)
    load()
  }

  async function toggleFeatured(id: string, current: boolean) {
    const supabase = createClient()
    // Erst alle anderen un-featuren, dann diesen togglen
    if (!current) {
      await supabase.from('articles').update({ is_featured: false }).neq('id', id)
    }
    await supabase.from('articles').update({ is_featured: !current }).eq('id', id)
    load()
  }

  async function deleteArticle(id: string, title: string) {
    if (!confirm(`Artikel löschen?\n"${title}"`)) return
    const supabase = createClient()
    await supabase.from('articles').delete().eq('id', id)
    load()
  }

  const published = articles.filter(a => a.published).length
  const drafts = articles.filter(a => !a.published).length
  const label: React.CSSProperties = { fontSize: 11, letterSpacing: '0.07em', textTransform: 'uppercase', fontWeight: 500 }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 30, fontWeight: 400, color: '#0f1e2e' }}>Artikel</h1>
          <p style={{ fontSize: 13, color: '#8aa0b8', marginTop: 2 }}>Alle Beiträge verwalten</p>
        </div>
        <button onClick={() => router.push('/admin/artikel/neu')}
          style={{ background: '#1a5a8a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
          + Neuer Artikel
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Gesamt', value: articles.length, color: '#1a5a8a' },
          { label: 'Veröffentlicht', value: published, color: '#1a8a50' },
          { label: 'Entwürfe', value: drafts, color: '#8aa0b8' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: '#fff', borderRadius: 10, padding: '18px 22px', boxShadow: '0 2px 12px rgba(15,30,46,0.06)' }}>
            <p style={{ fontSize: 11, color: '#8aa0b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{label}</p>
            <p style={{ fontSize: 28, fontFamily: "'Cormorant Garant', serif", fontWeight: 400, color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Article List */}
      {loading ? (
        <p style={{ color: '#8aa0b8', fontSize: 14 }}>Laden…</p>
      ) : (
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 20px rgba(15,30,46,0.07)', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 150px 44px 130px 130px', gap: 16, padding: '11px 24px', borderBottom: '1px solid #d8e0e8', background: '#f8fafc' }}>
            {['Titel', 'Kategorie', '⭐', 'Status', 'Aktionen'].map(h => (
              <span key={h} style={{ ...label, color: '#8aa0b8' }}>{h}</span>
            ))}
          </div>

          {articles.length === 0 && (
            <p style={{ padding: '32px 24px', color: '#8aa0b8', fontSize: 14 }}>Noch keine Artikel. Erstelle deinen ersten!</p>
          )}

          {articles.map((a, i) => (
            <div key={a.id} style={{ display: 'grid', gridTemplateColumns: '1fr 150px 44px 130px 130px', gap: 16, padding: '14px 24px', borderBottom: i < articles.length - 1 ? '1px solid #eef1f4' : 'none', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: 14, color: '#0f1e2e', fontWeight: 500, marginBottom: 2, lineHeight: 1.3 }}>{a.title}</p>
                <p style={{ fontSize: 11, color: '#8aa0b8' }}>
                  /{a.slug}{a.published_at ? ` · ${new Date(a.published_at).toLocaleDateString('de-DE')}` : ''}
                </p>
              </div>
              <span style={{ fontSize: 12, color: '#4a6278' }}>{a.category || '—'}</span>
              <button
                onClick={() => toggleFeatured(a.id, a.is_featured)}
                title={a.is_featured ? 'Featured entfernen' : 'Als Featured markieren'}
                style={{ background: a.is_featured ? 'rgba(255,200,0,0.15)' : 'transparent', border: `1px solid ${a.is_featured ? '#f0c040' : '#d8e0e8'}`, borderRadius: 6, padding: '4px 8px', fontSize: 16, cursor: 'pointer', lineHeight: 1 }}>
                {a.is_featured ? '⭐' : '☆'}
              </button>
              <button onClick={() => togglePublished(a.id, a.published)}
                style={{ background: a.published ? 'rgba(26,160,80,0.1)' : 'rgba(170,170,170,0.12)', color: a.published ? '#1a8a50' : '#8aa0b8', border: 'none', padding: '5px 12px', borderRadius: 20, fontSize: 11, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.04em' }}>
                {a.published ? '✓ Veröffentlicht' : '○ Entwurf'}
              </button>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => router.push(`/admin/artikel/${a.id}`)}
                  style={{ background: '#dce8f4', color: '#1a5a8a', border: 'none', padding: '6px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Bearbeiten
                </button>
                <button onClick={() => deleteArticle(a.id, a.title)}
                  style={{ background: '#fde8e8', color: '#c0392b', border: 'none', padding: '6px 10px', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
