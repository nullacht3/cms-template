'use client'
import { useState, useEffect, Suspense } from 'react'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { useTheme } from '@/context/ThemeContext'
import { CATEGORY_DISPLAY, CATEGORY_SLUG_MAP, CATEGORY_ORDER } from '@/lib/themes'
import { getArticles } from '@/lib/getArticles'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Post } from '@/lib/types'

const DISPLAY_CATS = [
  { label: 'Alle', slug: '' },
  { label: 'Treatments', slug: 'treatments' },
  { label: 'Beauty Trends', slug: 'trends' },
  { label: 'Wissen & Forschung', slug: 'wissen' },
  { label: 'Sprechstunde', slug: 'sprechstunde' },
]

function TagLabel({ label, t }: { label: string; t: any }) {
  return (
    <span style={{ background: t.tag.bg, color: t.tag.color, fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' as const, padding: '2px 8px', borderRadius: 20, fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
  )
}

function KategorienInner() {
  const { t } = useTheme()
  const router = useRouter()
  const searchParams = useSearchParams()
  const catSlug = searchParams.get('cat') || ''

  const [search, setSearch] = useState('')
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => { getArticles().then(setPosts) }, [])

  // Map slug → db category name
  const dbCat = catSlug ? (CATEGORY_SLUG_MAP[catSlug] || '') : ''

  const filtered = posts.filter((p) => {
    const catMatch = !dbCat || p.category === dbCat
    const searchMatch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase())
    return catMatch && searchMatch
  })

  const activeDisplay = DISPLAY_CATS.find((c) => c.slug === catSlug)
  const headingName = activeDisplay?.label !== 'Alle' && activeDisplay ? activeDisplay.label : 'Alle Artikel'

  function setActiveCat(slug: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (slug) params.set('cat', slug)
    else params.delete('cat')
    router.push(`/kategorien?${params.toString()}`)
  }

  return (
    <>
      <Nav />
      <div className="page-padding" style={{ maxWidth: 1140, margin: '0 auto', padding: '88px 28px 80px' }}>

        {/* Elle-style category heading */}
        <div style={{ borderTop: `3px solid ${t.text}`, paddingTop: 14, marginBottom: 36 }}>
          <h1
            className="kategorien-heading"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 'clamp(28px, 5vw, 56px)', fontWeight: 800, letterSpacing: '-0.03em', textTransform: 'uppercase', color: t.text, lineHeight: 1 }}
          >
            {headingName}
          </h1>
        </div>

        {/* Filter + search row */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' as const, marginBottom: 36 }}>
          {/* Category pills */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
            {DISPLAY_CATS.map((c) => (
              <button
                key={c.slug}
                onClick={() => setActiveCat(c.slug)}
                style={{ padding: '6px 14px', borderRadius: 0, border: `1px solid ${catSlug === c.slug ? t.text : t.border}`, background: catSlug === c.slug ? t.text : 'transparent', color: catSlug === c.slug ? '#fff' : t.textMuted, fontSize: 11, fontWeight: 500, letterSpacing: '0.06em', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'all 0.15s' }}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ position: 'relative', marginLeft: 'auto' }}>
            <svg style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: t.textLight }} width="13" height="13" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M11 11 L15 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <input
              placeholder="Suchen…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ padding: '8px 14px 8px 34px', background: t.surface, border: `1px solid ${t.border}`, borderRadius: 0, fontSize: 13, fontFamily: "'DM Sans', sans-serif", color: t.text, outline: 'none', width: 200 }}
            />
          </div>
        </div>

        <p style={{ fontSize: 11, color: t.textLight, marginBottom: 24, letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif" }}>{filtered.length} Artikel</p>

        <div style={{ display: 'flex', flexDirection: 'column' as const }}>
          {filtered.map((p) => (
            <div
              key={p.id}
              onClick={() => router.push(`/${p.slug}`)}
              style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: 20, padding: '20px 0', borderBottom: `1px solid ${t.borderLight}`, cursor: 'pointer', transition: 'background 0.12s', borderRadius: 4 }}
              onMouseEnter={(e) => (e.currentTarget.style.background = t.accentLight)}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ width: 96, height: 72, borderRadius: 8, overflow: 'hidden', flexShrink: 0, background: t.surfaceHover }}>
                {p.photo
                  ? <img src={p.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  : <div style={{ width: '100%', height: '100%', background: t.surfaceHover }} />
                }
              </div>

              <div style={{ paddingLeft: 4, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                  <TagLabel label={p.tag} t={t} />
                  <span style={{ fontSize: 10, color: t.textLight, letterSpacing: '0.07em', textTransform: 'uppercase' as const }}>
                    {CATEGORY_DISPLAY[p.category] || p.category}
                  </span>
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 20, fontWeight: 600, color: t.text, letterSpacing: '-0.01em', lineHeight: 1.3 }}>{p.title}</h3>
                <p style={{ fontSize: 13, color: t.textMuted, marginTop: 6, lineHeight: 1.6 }}>{p.excerpt}</p>
              </div>

              <div style={{ textAlign: 'right' as const, minWidth: 90, flexShrink: 0 }}>
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

export default function KategorienPage() {
  return (
    <Suspense fallback={null}>
      <KategorienInner />
    </Suspense>
  )
}
