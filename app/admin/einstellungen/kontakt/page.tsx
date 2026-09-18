'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getKontaktSettings, saveSetting, KONTAKT_DEFAULTS, type KontaktSettings } from '@/lib/siteSettings'

export default function KontaktSettings() {
  const [s, setS] = useState<KontaktSettings>(KONTAKT_DEFAULTS)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { getKontaktSettings().then(setS) }, [])

  function set(key: keyof KontaktSettings, value: string) {
    setS(prev => ({ ...prev, [key]: value }))
  }

  function setAddressLine(i: number, value: string) {
    setS(prev => {
      const lines = [...prev.address_lines]
      lines[i] = value
      return { ...prev, address_lines: lines }
    })
  }

  function addAddressLine() {
    setS(prev => ({ ...prev, address_lines: [...prev.address_lines, ''] }))
  }

  function removeAddressLine(i: number) {
    setS(prev => ({ ...prev, address_lines: prev.address_lines.filter((_, idx) => idx !== i) }))
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `author/${Date.now()}.${ext}`
    const { data, error } = await supabase.storage.from('images').upload(path, file, { contentType: file.type })
    if (error) { alert('Upload fehlgeschlagen: ' + error.message); setUploading(false); return }
    const { data: urlData } = supabase.storage.from('images').getPublicUrl(data.path)
    set('author_photo', urlData.publicUrl)
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleSave() {
    setSaving(true)
    await saveSetting('kontakt', s)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', border: '1px solid #d0dce8',
    borderRadius: 7, fontSize: 13, fontFamily: 'inherit', color: '#1a2e3d',
    outline: 'none', boxSizing: 'border-box',
  }
  const labelStyle: React.CSSProperties = {
    fontSize: 12, color: '#6b8499', display: 'block', marginBottom: 6,
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 28, fontWeight: 400, color: '#0f1e2e' }}>Kontaktseite</h1>
          <p style={{ fontSize: 13, color: '#8aa0b8', marginTop: 2 }}>Texte, Adresse, Autorenfoto verwalten</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <a href="/kontakt" target="_blank" style={{ fontSize: 12, color: '#8aa0b8', textDecoration: 'none' }}>↗ Vorschau</a>
          <button onClick={handleSave} disabled={saving}
            style={{ background: saved ? '#1a8a50' : '#1a5a8a', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.2s', minWidth: 110 }}>
            {saved ? '✓ Gespeichert' : saving ? 'Speichert…' : 'Speichern'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>

        {/* Linke Spalte */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Autorenfoto */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #d8e0e8', padding: '24px 28px' }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: '#1a2e3d', marginBottom: 18 }}>Autorenfoto</h2>
            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 16 }}>
              {/* Foto-Vorschau */}
              <div style={{ width: 100, height: 100, borderRadius: '50%', overflow: 'hidden', background: '#e8edf2', flexShrink: 0, border: '2px solid #d0dce8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {s.author_photo ? (
                  <img src={s.author_photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                ) : (
                  <span style={{ fontSize: 32, color: '#b0bec5' }}>👤</span>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Name</label>
                <input value={s.author_name} onChange={e => set('author_name', e.target.value)} style={{ ...inputStyle, marginBottom: 10 }} placeholder="Ronja Menzel" />
                <label style={labelStyle}>Rolle / Titel</label>
                <input value={s.author_role} onChange={e => set('author_role', e.target.value)} style={inputStyle} placeholder="z.B. Redakteurin, Gründerin" />
              </div>
            </div>
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
              style={{ background: '#1a5a8a', color: '#fff', border: 'none', padding: '9px 16px', borderRadius: 7, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', opacity: uploading ? 0.6 : 1, marginBottom: 10 }}>
              {uploading ? 'Lädt hoch…' : '📷 Foto hochladen'}
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
            {s.author_photo && (
              <div style={{ marginTop: 8 }}>
                <label style={labelStyle}>Oder URL direkt</label>
                <input value={s.author_photo} onChange={e => set('author_photo', e.target.value)} style={inputStyle} placeholder="https://..." />
              </div>
            )}
            {!s.author_photo && (
              <div style={{ marginTop: 8 }}>
                <label style={labelStyle}>Oder URL direkt eingeben</label>
                <input value={s.author_photo} onChange={e => set('author_photo', e.target.value)} style={inputStyle} placeholder="https://..." />
              </div>
            )}
          </div>

          {/* Texte */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #d8e0e8', padding: '24px 28px' }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: '#1a2e3d', marginBottom: 18 }}>Texte</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>Überschrift</label>
                <input value={s.heading} onChange={e => set('heading', e.target.value)} style={inputStyle} placeholder="Kontakt" />
              </div>
              <div>
                <label style={labelStyle}>Einleitungstext</label>
                <textarea value={s.intro_text} onChange={e => set('intro_text', e.target.value)} rows={3}
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                  placeholder="Fragen, Anregungen oder Kooperationsanfragen?" />
              </div>
              <div>
                <label style={labelStyle}>Hinweis-Text (unten)</label>
                <textarea value={s.note} onChange={e => set('note', e.target.value)} rows={3}
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                  placeholder="Diese Website ist kein medizinischer Anbieter…" />
              </div>
            </div>
          </div>
        </div>

        {/* Rechte Spalte */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Kontaktdaten */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #d8e0e8', padding: '24px 28px' }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: '#1a2e3d', marginBottom: 18 }}>Kontaktdaten</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>E-Mail-Adresse</label>
                <input type="email" value={s.email} onChange={e => set('email', e.target.value)} style={inputStyle} placeholder="info@beispiel.de" />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label style={{ ...labelStyle, marginBottom: 0 }}>Adresszeilen</label>
                  <button type="button" onClick={addAddressLine}
                    style={{ background: 'none', border: '1px solid #d0dce8', color: '#4a6278', padding: '3px 10px', borderRadius: 5, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>
                    + Zeile
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {s.address_lines.map((line, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8 }}>
                      <input value={line} onChange={e => setAddressLine(i, e.target.value)}
                        style={{ ...inputStyle, flex: 1 }} placeholder={`Zeile ${i + 1}`} />
                      <button type="button" onClick={() => removeAddressLine(i)}
                        style={{ background: 'none', border: '1px solid #fcc', color: '#c0392b', padding: '6px 10px', borderRadius: 6, fontSize: 14, cursor: 'pointer', flexShrink: 0 }}>
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Live-Vorschau */}
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #d8e0e8', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #e8eff5', background: '#f7fafd' }}>
              <p style={{ fontSize: 11, color: '#8aa0b8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>Vorschau linke Seite</p>
            </div>
            <div style={{ padding: '20px 24px' }}>
              {s.author_photo && (
                <img src={s.author_photo} style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', marginBottom: 12, display: 'block' }} alt="" />
              )}
              <h3 style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 22, fontWeight: 400, color: '#0f1e2e', marginBottom: 6 }}>{s.heading || 'Kontakt'}</h3>
              {s.author_name && <p style={{ fontSize: 13, fontWeight: 500, color: '#1a5a8a', marginBottom: 2 }}>{s.author_name}</p>}
              {s.author_role && <p style={{ fontSize: 12, color: '#8aa0b8', marginBottom: 10 }}>{s.author_role}</p>}
              <p style={{ fontSize: 13, color: '#4a6278', lineHeight: 1.7, marginBottom: 16 }}>{s.intro_text}</p>
              {s.address_lines.length > 0 && (
                <div style={{ marginBottom: 12 }}>
                  <p style={{ fontSize: 10, color: '#8aa0b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Adresse</p>
                  {s.address_lines.map((l, i) => <p key={i} style={{ fontSize: 13, color: '#4a6278' }}>{l}</p>)}
                </div>
              )}
              {s.email && (
                <div>
                  <p style={{ fontSize: 10, color: '#8aa0b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>E-Mail</p>
                  <p style={{ fontSize: 13, color: '#1a5a8a' }}>{s.email}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
