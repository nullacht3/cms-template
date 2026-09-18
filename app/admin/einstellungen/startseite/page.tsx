'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getHomepageSettings, saveSetting, HOMEPAGE_DEFAULTS, type HomepageSettings } from '@/lib/siteSettings'

type Article = { id: string; title: string; slug: string; is_featured: boolean; cover_image: string | null }

export default function StartseiteSettings() {
  const [settings, setSettings] = useState<HomepageSettings>(HOMEPAGE_DEFAULTS)
  const [articles, setArticles] = useState<Article[]>([])
  const [featuredId, setFeaturedId] = useState<string>('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    getHomepageSettings().then(setSettings)
    loadArticles()
  }, [])

  async function loadArticles() {
    const supabase = createClient()
    const { data } = await supabase
      .from('articles')
      .select('id, title, slug, is_featured, cover_image')
      .eq('published', true)
      .order('published_at', { ascending: false })
    if (data) {
      setArticles(data)
      const featured = data.find(a => a.is_featured)
      if (featured) setFeaturedId(featured.id)
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `hero/${Date.now()}.${ext}`
    const { data, error } = await supabase.storage.from('images').upload(path, file, { contentType: file.type })
    if (error) { alert('Upload fehlgeschlagen: ' + error.message); setUploading(false); return }
    const { data: urlData } = supabase.storage.from('images').getPublicUrl(data.path)
    setSettings(s => ({ ...s, hero_image: urlData.publicUrl }))
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleSave() {
    setSaving(true)
    // Save homepage settings
    await saveSetting('homepage', settings)
    // Update featured article
    if (featuredId) {
      const supabase = createClient()
      await supabase.from('articles').update({ is_featured: false }).neq('id', featuredId)
      await supabase.from('articles').update({ is_featured: true }).eq('id', featuredId)
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const selectedArticle = articles.find(a => a.id === featuredId)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 28, fontWeight: 400, color: '#0f1e2e' }}>Startseite</h1>
          <p style={{ fontSize: 13, color: '#8aa0b8', marginTop: 2 }}>Hero-Bild und Featured-Artikel verwalten</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          style={{ background: saved ? '#1a8a50' : '#1a5a8a', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s', minWidth: 100 }}>
          {saved ? '✓ Gespeichert' : saving ? 'Speichert…' : 'Speichern'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Hero Image */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #d8e0e8', padding: '24px 28px' }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: '#1a2e3d', marginBottom: 18 }}>Hero-Bild</h2>

            {/* Preview */}
            <div style={{ width: '100%', paddingBottom: '40%', position: 'relative', borderRadius: 8, overflow: 'hidden', background: '#e8edf2', marginBottom: 16 }}>
              {settings.hero_image && (
                <img src={settings.hero_image} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }} alt="" />
              )}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.6) 100%)' }} />
              <div style={{ position: 'absolute', bottom: 12, left: 16, right: 16 }}>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>{settings.hero_tagline}</p>
                <p style={{ fontSize: 16, fontFamily: "'Cormorant Garant', serif", color: '#f4f0ea', lineHeight: 1.2, fontWeight: 300 }}>
                  {settings.hero_title}<br /><em>{settings.hero_subtitle}</em>
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                style={{ background: '#1a5a8a', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', opacity: uploading ? 0.6 : 1 }}>
                {uploading ? 'Lädt hoch…' : '📷 Bild hochladen'}
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            </div>

            <div>
              <label style={{ fontSize: 12, color: '#6b8499', display: 'block', marginBottom: 6 }}>Oder URL direkt eingeben</label>
              <input
                value={settings.hero_image}
                onChange={e => setSettings(s => ({ ...s, hero_image: e.target.value }))}
                placeholder="https://..."
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #d0dce8', borderRadius: 7, fontSize: 13, fontFamily: 'inherit', color: '#1a2e3d', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Hero Text */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #d8e0e8', padding: '24px 28px' }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: '#1a2e3d', marginBottom: 18 }}>Hero-Text</h2>
            {[
              { key: 'hero_tagline', label: 'Tagline (Klein oben)', placeholder: 'Wissenschaft · Ästhetik · München' },
              { key: 'hero_title', label: 'Haupttitel', placeholder: 'Ästhetische Medizin' },
              { key: 'hero_subtitle', label: 'Untertitel (kursiv)', placeholder: 'mit wissenschaftlichem Anspruch.' },
              { key: 'hero_button_text', label: 'Button-Text', placeholder: 'Alle Artikel →' },
              { key: 'hero_button_url', label: 'Button-URL', placeholder: '/kategorien' },
            ].map(({ key, label, placeholder }) => (
              <div key={key} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, color: '#6b8499', display: 'block', marginBottom: 6 }}>{label}</label>
                <input
                  value={settings[key as keyof HomepageSettings]}
                  onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))}
                  placeholder={placeholder}
                  style={{ width: '100%', padding: '9px 12px', border: '1px solid #d0dce8', borderRadius: 7, fontSize: 13, fontFamily: 'inherit', color: '#1a2e3d', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            ))}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, color: '#6b8499', display: 'block', marginBottom: 6 }}>Beschreibungstext (rechts neben dem Titel)</label>
              <textarea
                value={settings.hero_description}
                onChange={e => setSettings(s => ({ ...s, hero_description: e.target.value }))}
                placeholder="Fundiertes Fachwissen, kuratierte Listen und Interviews…"
                rows={3}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #d0dce8', borderRadius: 7, fontSize: 13, fontFamily: 'inherit', color: '#1a2e3d', outline: 'none', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.6 }}
              />
            </div>
          </div>
        </div>

        {/* Right column: Featured Article */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #d8e0e8', padding: '24px 28px' }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: '#1a2e3d', marginBottom: 6 }}>Featured-Artikel</h2>
            <p style={{ fontSize: 12, color: '#8aa0b8', marginBottom: 18 }}>Dieser Artikel erscheint groß unterhalb des Hero-Bilds</p>

            {articles.length === 0 ? (
              <p style={{ fontSize: 13, color: '#8aa0b8' }}>Noch keine veröffentlichten Artikel</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {articles.map(a => (
                  <label key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 8, border: `1px solid ${featuredId === a.id ? '#1a5a8a' : '#d8e0e8'}`, background: featuredId === a.id ? '#eef4fb' : '#fff', cursor: 'pointer', transition: 'all 0.15s' }}>
                    <input
                      type="radio"
                      name="featured"
                      value={a.id}
                      checked={featuredId === a.id}
                      onChange={() => setFeaturedId(a.id)}
                      style={{ accentColor: '#1a5a8a', flexShrink: 0 }}
                    />
                    {a.cover_image ? (
                      <img src={a.cover_image} style={{ width: 52, height: 36, objectFit: 'cover', borderRadius: 5, flexShrink: 0 }} alt="" />
                    ) : (
                      <div style={{ width: 52, height: 36, background: '#e8edf2', borderRadius: 5, flexShrink: 0 }} />
                    )}
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: featuredId === a.id ? 600 : 400, color: featuredId === a.id ? '#1a5a8a' : '#1a2e3d', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</p>
                      <p style={{ fontSize: 11, color: '#8aa0b8' }}>/{a.slug}</p>
                    </div>
                    {featuredId === a.id && <span style={{ marginLeft: 'auto', fontSize: 16, flexShrink: 0 }}>⭐</span>}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Preview of selected article */}
          {selectedArticle && (
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #d8e0e8', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #e8eff5' }}>
                <p style={{ fontSize: 11, color: '#8aa0b8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Vorschau Featured-Artikel</p>
              </div>
              {selectedArticle.cover_image && (
                <div style={{ width: '100%', paddingBottom: '40%', position: 'relative', overflow: 'hidden' }}>
                  <img src={selectedArticle.cover_image} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                </div>
              )}
              <div style={{ padding: '16px 20px' }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#1a2e3d', lineHeight: 1.4 }}>{selectedArticle.title}</p>
                <p style={{ fontSize: 11, color: '#8aa0b8', marginTop: 4 }}>/{selectedArticle.slug}</p>
              </div>
            </div>
          )}

          <div style={{ background: '#fffbea', borderRadius: 10, border: '1px solid #f0e0a0', padding: '14px 16px' }}>
            <p style={{ fontSize: 12, color: '#7a6010', lineHeight: 1.6 }}>
              <strong>💡 Tipp:</strong> Du kannst Featured-Artikel auch direkt in der Artikelliste mit dem ☆ Stern-Button markieren.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
