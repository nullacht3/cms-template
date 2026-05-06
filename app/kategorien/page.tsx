'use client'
import { useState, useEffect } from 'react'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { useTheme } from '@/context/ThemeContext'
import { POSTS, CATEGORIES } from '@/lib/themes'
import { getArticles } from '@/lib/getArticles'
import { useRouter } from 'next/navigation'
import type { Post } from '@/lib/types'

function Chip({ label, t }: { label: string; t: any }) {
  return (
    <span style={{ background: t.tag.bg, color: t.tag.color, fontSize: 10, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' as const, padding: '2px 8px', borderRadius: 4, fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
  )
}

export default function KategorienPage() {
  const { t } = useTheme()
  const router = useRouter()
  const [active, setActive] = useState('Alle')
  const [search, setSearch] = useState('')
  const [posts, setPosts] = useState<Post[]>(POSTS)

  useEffect(() => {
    getArticles().then(setPosts)
  }, [])

  const filtered = posts.filter((p) => {
    const catMatch = active === 'Alle' || p.category === active
    const searchMatch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase())
    return catMatch && searchMatch
  })

  return (
    <>
      <Nav />
      <div className="page-padding" style={{ maxWidth: 1140, margin: '0 auto', padding: '100px 28px 80px' }}>
        <div style={{ marginBottom: 40 }}>
          <h1 className="kategorien-heading" style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 36, fontWeight: 400, color: t.text, letterSpacing: '-0.02em', marginBottom: 24 }}>Kategorien & Suche</h1>

          {/* Search */}
          <div style={{ position: 'relative', maxWidth: 480, marginBottom: 28 }}>
            <svg style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: t.textLight }} width="14" height="14" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M11 11 L15 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <input
              placeholder="Artikel suchen…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '11px 16px 11px 40px', background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, fontSize: 14, fontFamily: "'DM Sans', sans-serif", color: t.text, outline: 'none' }}
            />
          </div>

          {/* Category pills */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
            {CATEGORIES.map((cat) => (
              <button key={cat} onClick={() => setActive(cat)} style={{ padding: '7px 16px', borderRadius: 20, border: 'none', background: active === cat ? t.pill.activeBg : t.pill.bg, color: active === cat ? t.pill.activeColor : t.pill.color, fontSize: 13, fontWeight: active === cat ? 500 : 400, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.15s' }}>{cat}</button>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 12, color: t.textLight, marginBottom: 24, letterSpacing: '0.04em' }}>{filtered.length} Artikel gefunden</p>

        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 1 }}>
          {filtered.map((p) => (
            <div
              key={p.id}
              onClick={() => router.push(`/artikel/${p.slug}`)}
              style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 24, padding: '24px 0', borderBottom: `1px solid ${t.borderLight}`, cursor: 'pointer' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = t.accentLight)}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ paddingLeft: 4 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <Chip label={p.tag} t={t} />
                  <span style={{ fontSize: 10, color: t.textLight, letterSpacing: '0.05em', textTransform: 'uppercase' as const, alignSelf: 'center' }}>{p.category}</span>
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 20, fontWeight: 500, color: t.text, letterSpacing: '-0.01em', lineHeight: 1.3 }}>{p.title}</h3>
                <p style={{ fontSize: 13, color: t.textMuted, marginTop: 6, lineHeight: 1.6 }}>{p.excerpt}</p>
              </div>
              <div style={{ textAlign: 'right' as const, minWidth: 90 }}>
                <p style={{ fontSize: 11, color: t.textLight, marginBottom: 4 }}>{p.date}</p>
                <p style={{ fontSize: 11, color: t.textLight }}>{p.readTime}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  )
}
