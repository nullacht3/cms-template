'use client'
import { useState, useEffect } from 'react'
import { getFooterSettings, saveSetting, FOOTER_DEFAULTS } from '@/lib/siteSettings'
import type { NavItem } from '@/lib/siteSettings'

export default function FooterSettings() {
  const [copyright, setCopyright] = useState(FOOTER_DEFAULTS.copyright)
  const [tagline, setTagline] = useState(FOOTER_DEFAULTS.tagline)
  const [legalLinks, setLegalLinks] = useState<NavItem[]>(FOOTER_DEFAULTS.legal_links)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getFooterSettings().then(s => {
      setCopyright(s.copyright)
      setTagline(s.tagline)
      setLegalLinks(s.legal_links)
      setLoading(false)
    })
  }, [])

  function updateLink(i: number, field: keyof NavItem, value: string) {
    setLegalLinks(items => items.map((item, idx) => idx === i ? { ...item, [field]: value } : item))
  }
  function addLink() { setLegalLinks(items => [...items, { label: '', href: '/' }]) }
  function removeLink(i: number) { setLegalLinks(items => items.filter((_, idx) => idx !== i)) }

  async function handleSave() {
    setStatus('saving')
    try {
      await saveSetting('footer', { copyright, tagline, legal_links: legalLinks })
      setStatus('saved')
    } catch { setStatus('error') }
  }

  const input: React.CSSProperties = { width: '100%', padding: '10px 14px', border: '1px solid #ccd5de', borderRadius: 8, fontSize: 14, color: '#0f1e2e', outline: 'none', fontFamily: "'DM Sans', sans-serif", background: '#fff' }
  const label: React.CSSProperties = { display: 'block', fontSize: 11, color: '#8aa0b8', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 7, fontWeight: 500 }

  if (loading) return <p style={{ color: '#8aa0b8', fontSize: 14 }}>Laden…</p>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 30, fontWeight: 400, color: '#0f1e2e' }}>Footer</h1>
          <p style={{ fontSize: 13, color: '#8aa0b8', marginTop: 2 }}>Fußzeile und rechtliche Links</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {status === 'saved' && <span style={{ fontSize: 13, color: '#1a8a50' }}>Gespeichert ✓</span>}
          {status === 'error' && <span style={{ fontSize: 13, color: '#c0392b' }}>Fehler</span>}
          <button onClick={handleSave} disabled={status === 'saving'}
            style={{ background: '#1a5a8a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
            {status === 'saving' ? 'Speichern…' : 'Speichern'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 28, boxShadow: '0 2px 20px rgba(15,30,46,0.07)' }}>
          <h3 style={{ fontSize: 14, fontWeight: 500, color: '#0f1e2e', marginBottom: 20 }}>Texte</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={label}>Copyright-Zeile</label>
              <input value={copyright} onChange={e => setCopyright(e.target.value)} placeholder="© 2026 Mein Unternehmen" style={input} />
            </div>
            <div>
              <label style={label}>Tagline / Beschreibung</label>
              <textarea value={tagline} onChange={e => setTagline(e.target.value)} rows={2}
                placeholder="Kurze Beschreibung…" style={{ ...input, resize: 'vertical' }} />
            </div>
          </div>
        </div>

        {/* Vorschau */}
        <div style={{ background: '#0f1e2e', borderRadius: 12, padding: '24px 28px' }}>
          <p style={{ fontSize: 10, color: 'rgba(232,228,222,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Vorschau</p>
          <p style={{ fontSize: 12, color: 'rgba(232,228,222,0.55)', marginBottom: 8 }}>{tagline}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(232,228,222,0.1)', paddingTop: 12 }}>
            <p style={{ fontSize: 11, color: 'rgba(232,228,222,0.4)' }}>{copyright}</p>
            <div style={{ display: 'flex', gap: 16 }}>
              {legalLinks.map((l, i) => (
                <span key={i} style={{ fontSize: 11, color: 'rgba(232,228,222,0.5)' }}>{l.label || '…'}</span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, padding: 28, boxShadow: '0 2px 20px rgba(15,30,46,0.07)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 500, color: '#0f1e2e' }}>Rechtliche Links</h3>
            <button onClick={addLink}
              style={{ background: '#dce8f4', color: '#1a5a8a', border: 'none', padding: '7px 14px', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
              + Link
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {legalLinks.map((item, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 90px', gap: 10 }}>
                <input value={item.label} onChange={e => updateLink(i, 'label', e.target.value)}
                  placeholder="Bezeichnung" style={input} />
                <input value={item.href} onChange={e => updateLink(i, 'href', e.target.value)}
                  placeholder="/impressum" style={input} />
                <button onClick={() => removeLink(i)}
                  style={{ background: '#fde8e8', color: '#c0392b', border: 'none', padding: '10px', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                  ✕ Löschen
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
