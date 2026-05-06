'use client'
import { useState, useEffect } from 'react'
import { getHeaderSettings, saveSetting, HEADER_DEFAULTS } from '@/lib/siteSettings'
import type { NavItem } from '@/lib/siteSettings'

export default function HeaderSettings() {
  const [siteName, setSiteName] = useState(HEADER_DEFAULTS.site_name)
  const [logoUrl, setLogoUrl] = useState(HEADER_DEFAULTS.logo_url)
  const [tagline, setTagline] = useState(HEADER_DEFAULTS.tagline)
  const [navItems, setNavItems] = useState<NavItem[]>(HEADER_DEFAULTS.nav_items)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getHeaderSettings().then(s => {
      setSiteName(s.site_name)
      setLogoUrl(s.logo_url)
      setTagline(s.tagline)
      setNavItems(s.nav_items)
      setLoading(false)
    })
  }, [])

  function updateNavItem(i: number, field: keyof NavItem, value: string) {
    setNavItems(items => items.map((item, idx) => idx === i ? { ...item, [field]: value } : item))
  }
  function addNavItem() { setNavItems(items => [...items, { label: '', href: '/' }]) }
  function removeNavItem(i: number) { setNavItems(items => items.filter((_, idx) => idx !== i)) }
  function moveItem(i: number, dir: -1 | 1) {
    const arr = [...navItems]
    const j = i + dir
    if (j < 0 || j >= arr.length) return
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
    setNavItems(arr)
  }

  async function handleSave() {
    setStatus('saving')
    try {
      await saveSetting('header', { site_name: siteName, logo_url: logoUrl, tagline, nav_items: navItems })
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
          <h1 style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 30, fontWeight: 400, color: '#0f1e2e' }}>Header & Menü</h1>
          <p style={{ fontSize: 13, color: '#8aa0b8', marginTop: 2 }}>Logo, Seitenname und Navigation</p>
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
        {/* Branding */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 28, boxShadow: '0 2px 20px rgba(15,30,46,0.07)' }}>
          <h3 style={{ fontSize: 14, fontWeight: 500, color: '#0f1e2e', marginBottom: 20 }}>Branding</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div>
              <label style={label}>Seitenname / Logo-Text</label>
              <input value={siteName} onChange={e => setSiteName(e.target.value)} style={{ ...input, fontFamily: "'Cormorant Garant', serif", fontSize: 18 }} />
            </div>
            <div>
              <label style={label}>Tagline</label>
              <input value={tagline} onChange={e => setTagline(e.target.value)} style={input} />
            </div>
          </div>
          <div style={{ marginTop: 20 }}>
            <label style={label}>Logo-URL (Bild — leer lassen für Text-Logo)</label>
            <input value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="https://…/logo.svg" style={input} />
            {logoUrl && (
              <div style={{ marginTop: 12, padding: 16, background: '#f2f5f8', borderRadius: 8, display: 'inline-block' }}>
                <img src={logoUrl} alt="Logo Vorschau" style={{ height: 40, objectFit: 'contain' }} />
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div style={{ background: '#fff', borderRadius: 12, padding: 28, boxShadow: '0 2px 20px rgba(15,30,46,0.07)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 500, color: '#0f1e2e' }}>Navigationsmenü</h3>
            <button onClick={addNavItem}
              style={{ background: '#dce8f4', color: '#1a5a8a', border: 'none', padding: '7px 14px', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
              + Menüpunkt
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {navItems.map((item, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '32px 1fr 1fr 80px', gap: 10, alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <button onClick={() => moveItem(i, -1)} disabled={i === 0}
                    style={{ background: 'none', border: '1px solid #ccd5de', borderRadius: 4, fontSize: 10, cursor: 'pointer', padding: '2px 6px', opacity: i === 0 ? 0.3 : 1 }}>↑</button>
                  <button onClick={() => moveItem(i, 1)} disabled={i === navItems.length - 1}
                    style={{ background: 'none', border: '1px solid #ccd5de', borderRadius: 4, fontSize: 10, cursor: 'pointer', padding: '2px 6px', opacity: i === navItems.length - 1 ? 0.3 : 1 }}>↓</button>
                </div>
                <input value={item.label} onChange={e => updateNavItem(i, 'label', e.target.value)}
                  placeholder="Bezeichnung" style={input} />
                <input value={item.href} onChange={e => updateNavItem(i, 'href', e.target.value)}
                  placeholder="/seite" style={input} />
                <button onClick={() => removeNavItem(i)}
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
