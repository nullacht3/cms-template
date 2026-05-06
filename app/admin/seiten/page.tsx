'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const STATIC_PAGES = [
  { slug: 'impressum', title: 'Impressum', path: '/impressum', icon: '⚖️' },
  { slug: 'datenschutz', title: 'Datenschutzerklärung', path: '/datenschutz', icon: '🔒' },
  { slug: 'kontakt', title: 'Kontakt', path: '/kontakt', icon: '✉️' },
]

type PageMeta = { slug: string; title: string; updated_at: string | null }

export default function SeitenPage() {
  const router = useRouter()
  const [pages, setPages] = useState<PageMeta[]>([])

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase.from('pages').select('slug, title, updated_at')
      setPages(data || [])
    }
    load()
  }, [])

  function getUpdated(slug: string) {
    const p = pages.find(p => p.slug === slug)
    if (!p?.updated_at) return 'Noch nicht bearbeitet'
    return `Zuletzt: ${new Date(p.updated_at).toLocaleDateString('de-DE')}`
  }

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 30, fontWeight: 400, color: '#0f1e2e' }}>Seiten</h1>
        <p style={{ fontSize: 13, color: '#8aa0b8', marginTop: 2 }}>Statische Seiten bearbeiten</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {STATIC_PAGES.map(page => (
          <div key={page.slug} style={{ background: '#fff', borderRadius: 12, padding: '20px 24px', boxShadow: '0 2px 12px rgba(15,30,46,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ fontSize: 22 }}>{page.icon}</span>
              <div>
                <p style={{ fontSize: 14, fontWeight: 500, color: '#0f1e2e', marginBottom: 2 }}>{page.title}</p>
                <p style={{ fontSize: 11, color: '#8aa0b8' }}>
                  {page.path} · {getUpdated(page.slug)}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <a href={page.path} target="_blank"
                style={{ background: '#f2f5f8', color: '#4a6278', border: 'none', padding: '7px 14px', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'none' }}>
                ↗ Ansehen
              </a>
              <button onClick={() => router.push(`/admin/seiten/${page.slug}`)}
                style={{ background: '#dce8f4', color: '#1a5a8a', border: 'none', padding: '7px 14px', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                Bearbeiten
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 32, padding: '20px 24px', background: '#fff8f0', borderRadius: 12, border: '1px solid #fde8cc' }}>
        <p style={{ fontSize: 13, color: '#8a6040', fontWeight: 500, marginBottom: 4 }}>ℹ️ Startseite</p>
        <p style={{ fontSize: 12, color: '#a07850', lineHeight: 1.6 }}>
          Die Startseite wird über <strong>Artikel</strong> gesteuert — Featured-Artikel erscheinen automatisch im Hero-Bereich. Header & Footer lassen sich unter <strong>Einstellungen</strong> anpassen.
        </p>
      </div>
    </div>
  )
}
