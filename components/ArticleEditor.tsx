'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { RichTextEditor } from './RichTextEditor'

const CATEGORIES = ['Behandlungen', 'Wissen & Forschung', 'Trends', 'Ärzte & Kliniken']
const TAGS = ['Fachwissen', 'Vergleich', 'Studie', 'Interview', 'Trend', 'Ratgeber', 'Kosten', 'Mythen']

function slugify(text: string) {
  return text.toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

type FormData = {
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image: string
  category: string
  tag: string
  read_time: string
  is_featured: boolean
  published: boolean
  seo_title: string
  meta_description: string
}

type Props = {
  id?: string
  initial?: Partial<FormData>
}

export function ArticleEditor({ id, initial }: Props) {
  const router = useRouter()
  const isNew = !id
  const [form, setForm] = useState<FormData>({
    title: '', slug: '', excerpt: '', content: '', cover_image: '',
    category: CATEGORIES[0], tag: TAGS[0], read_time: '5 Min.',
    is_featured: false, published: false,
    seo_title: '', meta_description: '',
    ...initial,
  })
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [msg, setMsg] = useState('')

  function set(key: keyof FormData, value: string | boolean) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function handleTitleChange(title: string) {
    setForm(f => ({
      ...f,
      title,
      slug: isNew ? slugify(title) : f.slug,
      seo_title: f.seo_title === '' || f.seo_title === f.title ? title : f.seo_title,
    }))
  }

  async function handleSave(publish = false) {
    if (!form.title || !form.slug) { setMsg('Titel und Slug sind Pflichtfelder.'); return }
    setStatus('saving')
    setMsg('')
    const supabase = createClient()
    const payload = {
      title: form.title, slug: form.slug, excerpt: form.excerpt,
      content: form.content || null, cover_image: form.cover_image || null,
      category: form.category, tags: [form.tag],
      read_time: form.read_time, is_featured: form.is_featured,
      published: publish || form.published,
      published_at: (publish || form.published) ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
      seo_title: form.seo_title || null,
      meta_description: form.meta_description || null,
    }

    const { error } = isNew
      ? await supabase.from('articles').insert(payload)
      : await supabase.from('articles').update(payload).eq('id', id)

    if (error) { setStatus('error'); setMsg(error.message) }
    else { setStatus('saved'); setMsg('Gespeichert ✓'); if (isNew) router.push('/admin') }
  }

  const input: React.CSSProperties = { width: '100%', padding: '10px 14px', border: '1px solid #ccd5de', borderRadius: 8, fontSize: 14, color: '#0f1e2e', outline: 'none', fontFamily: "'DM Sans', sans-serif", background: '#fff' }
  const label: React.CSSProperties = { display: 'block', fontSize: 11, color: '#8aa0b8', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 7, fontWeight: 500 }

  // SEO preview values
  const seoTitle = form.seo_title || form.title || 'Seitentitel'
  const seoDesc = form.meta_description || form.excerpt || 'Beschreibung erscheint hier…'
  const seoUrl = `deraesthet.de/artikel/${form.slug || 'artikel-slug'}`
  const titleLen = seoTitle.length
  const descLen = seoDesc.length

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => router.push('/admin')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8aa0b8', fontSize: 13, fontFamily: 'inherit', padding: '4px 0' }}>
            ← Zurück
          </button>
          <h1 style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 28, fontWeight: 400, color: '#0f1e2e' }}>
            {isNew ? 'Neuer Artikel' : 'Artikel bearbeiten'}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {msg && <span style={{ fontSize: 13, color: status === 'error' ? '#c0392b' : '#1a8a50' }}>{msg}</span>}
          <button onClick={() => handleSave(false)} disabled={status === 'saving'}
            style={{ background: '#dce8f4', color: '#1a5a8a', border: 'none', padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
            {status === 'saving' ? 'Speichern…' : 'Entwurf speichern'}
          </button>
          <button onClick={() => handleSave(true)} disabled={status === 'saving'}
            style={{ background: '#1a5a8a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
            Veröffentlichen
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>
        {/* Main */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Titel & Slug */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 28, boxShadow: '0 2px 20px rgba(15,30,46,0.07)' }}>
            <div style={{ marginBottom: 18 }}>
              <label style={label}>Titel *</label>
              <input value={form.title} onChange={e => handleTitleChange(e.target.value)} placeholder="Artikeltitel…" style={{ ...input, fontSize: 18, fontFamily: "'Cormorant Garant', serif" }} />
            </div>
            <div>
              <label style={label}>Slug (URL) *</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, color: '#8aa0b8', whiteSpace: 'nowrap' }}>deraesthet.de/artikel/</span>
                <input value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="artikel-slug" style={{ ...input }} />
              </div>
            </div>
          </div>

          {/* Teaser */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 28, boxShadow: '0 2px 20px rgba(15,30,46,0.07)' }}>
            <label style={label}>Teaser / Excerpt</label>
            <textarea value={form.excerpt} onChange={e => set('excerpt', e.target.value)} rows={3} placeholder="Kurzbeschreibung für Artikelkarten…" style={{ ...input, resize: 'vertical' }} />
          </div>

          {/* Rich Text Content */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 28, boxShadow: '0 2px 20px rgba(15,30,46,0.07)' }}>
            <label style={{ ...label, marginBottom: 14 }}>Inhalt</label>
            <RichTextEditor
              value={form.content}
              onChange={v => set('content', v)}
              placeholder="Artikeltext hier eingeben…"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* SEO */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 20px rgba(15,30,46,0.07)' }}>
            <h3 style={{ fontSize: 13, fontWeight: 500, color: '#0f1e2e', marginBottom: 4 }}>SEO</h3>
            <p style={{ fontSize: 11, color: '#8aa0b8', marginBottom: 16 }}>Wie der Artikel bei Google erscheint</p>

            {/* Google Preview */}
            <div style={{ background: '#f8fafc', borderRadius: 8, padding: '14px 16px', marginBottom: 16, border: '1px solid #e8edf2' }}>
              <p style={{ fontSize: 10, color: '#8aa0b8', marginBottom: 4, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Vorschau</p>
              <p style={{ fontSize: 13, color: '#1a0dab', marginBottom: 2, fontWeight: 500, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{seoTitle}</p>
              <p style={{ fontSize: 11, color: '#006621', marginBottom: 4 }}>{seoUrl}</p>
              <p style={{ fontSize: 12, color: '#545454', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{seoDesc}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                  <label style={{ ...label, marginBottom: 0 }}>SEO-Titel</label>
                  <span style={{ fontSize: 10, color: titleLen > 60 ? '#c0392b' : titleLen > 50 ? '#e67e22' : '#8aa0b8' }}>{titleLen}/60</span>
                </div>
                <input value={form.seo_title} onChange={e => set('seo_title', e.target.value)} placeholder={form.title || 'SEO-Titel…'} style={input} />
                <p style={{ fontSize: 10, color: '#8aa0b8', marginTop: 4 }}>Leer lassen = Artikeltitel wird verwendet</p>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
                  <label style={{ ...label, marginBottom: 0 }}>Meta-Description</label>
                  <span style={{ fontSize: 10, color: descLen > 160 ? '#c0392b' : descLen > 140 ? '#e67e22' : '#8aa0b8' }}>{descLen}/160</span>
                </div>
                <textarea value={form.meta_description} onChange={e => set('meta_description', e.target.value)} rows={3} placeholder={form.excerpt || 'Kurzbeschreibung für Google…'} style={{ ...input, resize: 'vertical', fontSize: 13 }} />
                <p style={{ fontSize: 10, color: '#8aa0b8', marginTop: 4 }}>Leer lassen = Teaser wird verwendet</p>
              </div>
            </div>
          </div>

          {/* Metadaten */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 20px rgba(15,30,46,0.07)' }}>
            <h3 style={{ fontSize: 13, fontWeight: 500, color: '#0f1e2e', marginBottom: 16 }}>Metadaten</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={label}>Kategorie</label>
                <select value={form.category} onChange={e => set('category', e.target.value)} style={{ ...input }}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={label}>Tag</label>
                <select value={form.tag} onChange={e => set('tag', e.target.value)} style={{ ...input }}>
                  {TAGS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={label}>Lesezeit</label>
                <input value={form.read_time} onChange={e => set('read_time', e.target.value)} placeholder="5 Min." style={input} />
              </div>
            </div>
          </div>

          {/* Coverbild */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 20px rgba(15,30,46,0.07)' }}>
            <h3 style={{ fontSize: 13, fontWeight: 500, color: '#0f1e2e', marginBottom: 16 }}>Coverbild</h3>
            <input value={form.cover_image} onChange={e => set('cover_image', e.target.value)} placeholder="https://images.unsplash.com/…" style={input} />
            {form.cover_image && (
              <img src={form.cover_image} alt="" style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', borderRadius: 8, marginTop: 12 }} />
            )}
          </div>

          {/* Optionen */}
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 20px rgba(15,30,46,0.07)' }}>
            <h3 style={{ fontSize: 13, fontWeight: 500, color: '#0f1e2e', marginBottom: 14 }}>Optionen</h3>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: 10 }}>
              <input type="checkbox" checked={form.is_featured} onChange={e => set('is_featured', e.target.checked)}
                style={{ width: 16, height: 16, accentColor: '#1a5a8a' }} />
              <span style={{ fontSize: 14, color: '#4a6278' }}>Als Featured anzeigen</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)}
                style={{ width: 16, height: 16, accentColor: '#1a5a8a' }} />
              <span style={{ fontSize: 14, color: '#4a6278' }}>Veröffentlicht</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
