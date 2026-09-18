'use client'
import { useEffect, useState, useRef, useCallback } from 'react'

type MediaItem = {
  id: string
  filename: string
  url: string
  mime_type: string
  size: number
  alt: string
  caption: string
  source: string
  created_at: string
}

function formatSize(bytes: number) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB'
  return (bytes / 1024 / 1024).toFixed(1) + ' MB'
}

function isPdf(item: MediaItem) {
  return item.mime_type === 'application/pdf'
}

export default function MediathekPage() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<MediaItem | null>(null)
  const [filter, setFilter] = useState<'alle' | 'bilder' | 'pdfs'>('alle')
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)
  const [alt, setAlt] = useState('')
  const [caption, setCaption] = useState('')
  const [source, setSource] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/media')
    if (res.ok) setItems(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  // Wenn ein Item ausgewählt wird, Felder befüllen
  useEffect(() => {
    if (selected) {
      setAlt(selected.alt || '')
      setCaption(selected.caption || '')
      setSource(selected.source || '')
    }
  }, [selected?.id])

  async function upload(files: FileList | File[]) {
    setUploading(true)
    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/media', { method: 'POST', body: fd })
      if (!res.ok) {
        const d = await res.json()
        alert(d.error || 'Upload fehlgeschlagen')
      }
    }
    await load()
    setUploading(false)
  }

  async function save() {
    if (!selected) return
    setSaving(true)
    const res = await fetch(`/api/admin/media/${selected.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alt, caption, source }),
    })
    if (res.ok) {
      const updated = await res.json()
      setItems(prev => prev.map(i => i.id === updated.id ? updated : i))
      setSelected(updated)
    }
    setSaving(false)
  }

  async function deleteItem() {
    if (!selected) return
    if (!confirm(`„${selected.filename}" wirklich löschen?`)) return
    await fetch(`/api/admin/media/${selected.id}`, { method: 'DELETE' })
    setItems(prev => prev.filter(i => i.id !== selected.id))
    setSelected(null)
  }

  function copyUrl() {
    if (!selected) return
    navigator.clipboard.writeText(selected.url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files.length) upload(e.dataTransfer.files)
  }, [])

  const filtered = items.filter(i => {
    if (filter === 'bilder') return !isPdf(i)
    if (filter === 'pdfs') return isPdf(i)
    return true
  })

  const images = items.filter(i => !isPdf(i)).length
  const pdfs = items.filter(i => isPdf(i)).length

  return (
    <div style={{ display: 'flex', gap: 0, height: 'calc(100vh - 52px)', margin: '-36px -40px' }}>

      {/* Hauptbereich */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, padding: '28px 28px 0' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 600, color: '#1a2e3d', marginBottom: 2 }}>Mediathek</h1>
            <p style={{ fontSize: 13, color: '#6b8499' }}>
              <strong style={{ color: '#1a5a8a' }}>{items.length}</strong> Dateien · {images} Bilder · {pdfs} PDFs
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {/* Filter */}
            <div style={{ display: 'flex', background: '#f0f4f8', borderRadius: 8, padding: 3 }}>
              {(['alle', 'bilder', 'pdfs'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  style={{ padding: '5px 12px', borderRadius: 6, border: 'none', background: filter === f ? '#fff' : 'transparent', color: filter === f ? '#1a2e3d' : '#8aa0b8', fontSize: 12, fontWeight: filter === f ? 500 : 400, cursor: 'pointer', fontFamily: 'inherit', boxShadow: filter === f ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            {/* Upload Button */}
            <button onClick={() => fileRef.current?.click()} disabled={uploading}
              style={{ padding: '8px 18px', background: '#1a5a8a', color: '#fff', border: 'none', borderRadius: 7, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', opacity: uploading ? 0.7 : 1 }}>
              {uploading ? 'Lädt hoch…' : '↑ Hochladen'}
            </button>
            <input ref={fileRef} type="file" multiple accept="image/*,application/pdf" style={{ display: 'none' }}
              onChange={e => e.target.files && upload(e.target.files)} />
          </div>
        </div>

        {/* Drop-Zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          style={{ flex: 1, overflowY: 'auto', paddingBottom: 28 }}
        >
          {/* Drag Overlay */}
          {dragging && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(26,90,138,0.12)', border: '3px dashed #1a5a8a', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <p style={{ fontSize: 20, color: '#1a5a8a', fontWeight: 600 }}>Dateien hier ablegen</p>
            </div>
          )}

          {loading ? (
            <p style={{ color: '#8aa0b8', fontSize: 14, marginTop: 40, textAlign: 'center' }}>Lädt…</p>
          ) : filtered.length === 0 ? (
            <div onClick={() => fileRef.current?.click()}
              style={{ border: '2px dashed #d8e0e8', borderRadius: 12, padding: '60px 40px', textAlign: 'center', cursor: 'pointer', marginTop: 20 }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#1a5a8a')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#d8e0e8')}
            >
              <p style={{ fontSize: 36, marginBottom: 12 }}>🖼</p>
              <p style={{ color: '#6b8499', fontSize: 14, marginBottom: 4 }}>Noch keine Dateien</p>
              <p style={{ color: '#8aa0b8', fontSize: 12 }}>Klicken oder Dateien hierher ziehen</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, marginTop: 4 }}>
              {filtered.map(item => (
                <div key={item.id} onClick={() => setSelected(item)}
                  style={{ borderRadius: 8, overflow: 'hidden', cursor: 'pointer', border: `2px solid ${selected?.id === item.id ? '#1a5a8a' : 'transparent'}`, background: '#fff', boxShadow: '0 1px 6px rgba(15,30,46,0.07)', transition: 'border-color 0.15s, transform 0.15s' }}
                  onMouseEnter={e => { if (selected?.id !== item.id) e.currentTarget.style.borderColor = '#b8ccdc' }}
                  onMouseLeave={e => { if (selected?.id !== item.id) e.currentTarget.style.borderColor = 'transparent' }}
                >
                  {/* Vorschau */}
                  <div style={{ width: '100%', paddingBottom: '75%', position: 'relative', background: '#f0f4f8' }}>
                    {isPdf(item) ? (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 32 }}>📄</span>
                        <span style={{ fontSize: 9, color: '#8aa0b8', marginTop: 4, fontWeight: 600, letterSpacing: '0.06em' }}>PDF</span>
                      </div>
                    ) : (
                      <img src={item.url} alt={item.alt || item.filename}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                  </div>
                  {/* Name */}
                  <div style={{ padding: '8px 10px' }}>
                    <p style={{ fontSize: 11, color: '#1a2e3d', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.filename}</p>
                    <p style={{ fontSize: 10, color: '#8aa0b8', marginTop: 2 }}>{formatSize(item.size)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detail-Panel */}
      <div style={{ width: selected ? 300 : 0, borderLeft: selected ? '1px solid #d8e0e8' : 'none', background: '#fff', overflowY: 'auto', transition: 'width 0.2s', flexShrink: 0 }}>
        {selected && (
          <div style={{ padding: '24px 20px', minWidth: 300 }}>
            {/* Vorschau */}
            <div style={{ borderRadius: 8, overflow: 'hidden', background: '#f0f4f8', marginBottom: 18, aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isPdf(selected) ? (
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: 48 }}>📄</span>
                  <p style={{ fontSize: 11, color: '#8aa0b8', marginTop: 8 }}>PDF-Dokument</p>
                </div>
              ) : (
                <img src={selected.url} alt={selected.alt || selected.filename}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              )}
            </div>

            {/* Datei-Info */}
            <div style={{ marginBottom: 18, padding: '12px 14px', background: '#f7fafd', borderRadius: 8 }}>
              <p style={{ fontSize: 12, color: '#1a2e3d', fontWeight: 500, marginBottom: 4, wordBreak: 'break-all' }}>{selected.filename}</p>
              <p style={{ fontSize: 11, color: '#8aa0b8' }}>{formatSize(selected.size)} · {new Date(selected.created_at).toLocaleDateString('de-DE')}</p>
            </div>

            {/* Alt-Text */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, color: '#8aa0b8', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 6, fontWeight: 500 }}>
                Alt-Text
              </label>
              <input value={alt} onChange={e => setAlt(e.target.value)}
                placeholder="Bildbeschreibung für Barrierefreiheit"
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #d0dce8', borderRadius: 7, fontSize: 13, fontFamily: 'inherit', color: '#1a2e3d', outline: 'none', boxSizing: 'border-box' }} />
              <p style={{ fontSize: 10, color: '#aab8c4', marginTop: 4 }}>Für Suchmaschinen & Screenreader</p>
            </div>

            {/* Quelle */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, color: '#8aa0b8', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 6, fontWeight: 500 }}>
                Quelle / Lizenz
              </label>
              <input value={source} onChange={e => setSource(e.target.value)}
                placeholder="z.B. Unsplash – https://unsplash.com/photos/..."
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #d0dce8', borderRadius: 7, fontSize: 13, fontFamily: 'inherit', color: '#1a2e3d', outline: 'none', boxSizing: 'border-box' }} />
              <p style={{ fontSize: 10, color: '#aab8c4', marginTop: 4 }}>Fotograf, Lizenz oder Herkunft</p>
            </div>

            {/* Bildunterschrift */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 11, color: '#8aa0b8', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 6, fontWeight: 500 }}>
                Bildunterschrift
              </label>
              <textarea value={caption} onChange={e => setCaption(e.target.value)}
                placeholder="Wird unter dem Bild angezeigt"
                rows={3}
                style={{ width: '100%', padding: '9px 12px', border: '1px solid #d0dce8', borderRadius: 7, fontSize: 13, fontFamily: 'inherit', color: '#1a2e3d', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
            </div>

            {/* Speichern */}
            <button onClick={save} disabled={saving}
              style={{ width: '100%', padding: '10px', background: '#1a5a8a', color: '#fff', border: 'none', borderRadius: 7, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 10, opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Speichern…' : '✓ Speichern'}
            </button>

            {/* URL kopieren */}
            <button onClick={copyUrl}
              style={{ width: '100%', padding: '9px', background: '#f0f4f8', color: '#1a2e3d', border: '1px solid #d8e0e8', borderRadius: 7, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 10 }}>
              {copied ? '✓ URL kopiert!' : '🔗 URL kopieren'}
            </button>

            {/* Löschen */}
            <button onClick={deleteItem}
              style={{ width: '100%', padding: '9px', background: 'none', color: '#c0392b', border: '1px solid #f5c6c1', borderRadius: 7, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#fdf0ee')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              Löschen
            </button>

            {/* Schließen */}
            <button onClick={() => setSelected(null)}
              style={{ width: '100%', padding: '8px', background: 'none', color: '#8aa0b8', border: 'none', borderRadius: 7, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', marginTop: 6 }}>
              Schließen
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
