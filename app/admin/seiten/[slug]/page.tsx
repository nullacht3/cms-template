'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { RichTextEditor } from '@/components/RichTextEditor'

export default function PageEditor() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [seoTitle, setSeoTitle] = useState('')
  const [metaDesc, setMetaDesc] = useState('')
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase.from('pages').select('*').eq('slug', slug).single()
      if (data) {
        setTitle(data.title || '')
        setContent(data.content || '')
        setSeoTitle(data.seo_title || '')
        setMetaDesc(data.meta_description || '')
      }
      setLoading(false)
    }
    load()
  }, [slug])

  async function handleSave() {
    setStatus('saving')
    const supabase = createClient()
    const { error } = await supabase.from('pages').upsert({
      slug, title, content, seo_title: seoTitle || null,
      meta_description: metaDesc || null, updated_at: new Date().toISOString()
    })
    setStatus(error ? 'error' : 'saved')
  }

  const input: React.CSSProperties = { width: '100%', padding: '10px 14px', border: '1px solid #ccd5de', borderRadius: 8, fontSize: 14, color: '#0f1e2e', outline: 'none', fontFamily: "'DM Sans', sans-serif", background: '#fff' }
  const label: React.CSSProperties = { display: 'block', fontSize: 11, color: '#8aa0b8', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 7, fontWeight: 500 }

  if (loading) return <p style={{ color: '#8aa0b8', fontSize: 14 }}>Laden…</p>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => router.push('/admin/seiten')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8aa0b8', fontSize: 13, fontFamily: 'inherit' }}>
            ← Zurück
          </button>
          <h1 style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 28, fontWeight: 400, color: '#0f1e2e' }}>{title}</h1>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {status === 'saved' && <span style={{ fontSize: 13, color: '#1a8a50' }}>Gespeichert ✓</span>}
          {status === 'error' && <span style={{ fontSize: 13, color: '#c0392b' }}>Fehler beim Speichern</span>}
          <button onClick={handleSave} disabled={status === 'saving'}
            style={{ background: '#1a5a8a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
            {status === 'saving' ? 'Speichern…' : 'Speichern'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 28, boxShadow: '0 2px 20px rgba(15,30,46,0.07)' }}>
            <label style={label}>Seitentitel</label>
            <input value={title} onChange={e => setTitle(e.target.value)} style={{ ...input, fontSize: 18, fontFamily: "'Cormorant Garant', serif" }} />
          </div>
          <div style={{ background: '#fff', borderRadius: 12, padding: 28, boxShadow: '0 2px 20px rgba(15,30,46,0.07)' }}>
            <label style={{ ...label, marginBottom: 14 }}>Inhalt</label>
            <RichTextEditor value={content} onChange={setContent} placeholder="Seiteninhalt hier eingeben…" />
          </div>
        </div>

        {/* SEO Sidebar */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 20px rgba(15,30,46,0.07)' }}>
          <h3 style={{ fontSize: 13, fontWeight: 500, color: '#0f1e2e', marginBottom: 4 }}>SEO</h3>
          <p style={{ fontSize: 11, color: '#8aa0b8', marginBottom: 16 }}>Wie die Seite bei Google erscheint</p>

          <div style={{ background: '#f8fafc', borderRadius: 8, padding: '14px 16px', marginBottom: 16, border: '1px solid #e8edf2' }}>
            <p style={{ fontSize: 10, color: '#8aa0b8', marginBottom: 4, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Vorschau</p>
            <p style={{ fontSize: 13, color: '#1a0dab', fontWeight: 500, marginBottom: 2 }}>{seoTitle || title} | Der Ästhet</p>
            <p style={{ fontSize: 11, color: '#006621', marginBottom: 4 }}>deraesthet.de/{slug}</p>
            <p style={{ fontSize: 12, color: '#545454', lineHeight: 1.5 }}>{metaDesc || 'Keine Beschreibung gesetzt.'}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                <label style={{ ...label, marginBottom: 0 }}>SEO-Titel</label>
                <span style={{ fontSize: 10, color: seoTitle.length > 60 ? '#c0392b' : '#8aa0b8' }}>{seoTitle.length}/60</span>
              </div>
              <input value={seoTitle} onChange={e => setSeoTitle(e.target.value)} placeholder={title} style={input} />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                <label style={{ ...label, marginBottom: 0 }}>Meta-Description</label>
                <span style={{ fontSize: 10, color: metaDesc.length > 160 ? '#c0392b' : '#8aa0b8' }}>{metaDesc.length}/160</span>
              </div>
              <textarea value={metaDesc} onChange={e => setMetaDesc(e.target.value)} rows={4}
                placeholder="Kurzbeschreibung für Google…"
                style={{ ...input, resize: 'vertical', fontSize: 13 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
