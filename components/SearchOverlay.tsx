'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'
import { CATEGORIES } from '@/lib/themes'
import { getArticles } from '@/lib/getArticles'
import type { Post } from '@/lib/types'

export function SearchOverlay({ onClose }: { onClose: () => void }) {
  const { t } = useTheme()
  const [q, setQ] = useState('')
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => { getArticles().then(setPosts) }, [])
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50)
    const fn = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  const results = q.length > 1 ? posts.filter((p) =>
    p.title.toLowerCase().includes(q.toLowerCase()) ||
    p.category.toLowerCase().includes(q.toLowerCase())
  ) : []

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 120 }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{ background: t.surface, borderRadius: 14, width: '100%', maxWidth: 600, boxShadow: t.shadowHover, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 20px', borderBottom: `1px solid ${t.border}` }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: t.textMuted, flexShrink: 0 }}>
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M11 11 L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input ref={inputRef} placeholder="Thema, Kategorie oder Stichwort suchen…" value={q} onChange={(e) => setQ(e.target.value)} style={{ flex: 1, padding: '18px 16px', border: 'none', outline: 'none', background: 'transparent', fontSize: 16, fontFamily: "'DM Sans', sans-serif", color: t.text }} />
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.textMuted, fontSize: 20, padding: '4px 8px' }}>×</button>
        </div>
        {results.length > 0 && (
          <div style={{ maxHeight: 360, overflowY: 'auto' }}>
            {results.map((p) => (
              <div key={p.id} onClick={() => { router.push(`/${p.slug}`); onClose() }} style={{ padding: '16px 20px', borderBottom: `1px solid ${t.borderLight}`, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onMouseEnter={(e) => (e.currentTarget.style.background = t.accentLight)} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                <div>
                  <span style={{ background: t.tag.bg, color: t.tag.color, fontSize: 10, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '2px 8px', borderRadius: 4 }}>{p.tag}</span>
                  <p style={{ fontSize: 17, color: t.text, marginTop: 6, fontFamily: "'Cormorant Garant', serif" }}>{p.title}</p>
                </div>
                <span style={{ fontSize: 11, color: t.textLight, flexShrink: 0, marginLeft: 16 }}>{p.readTime}</span>
              </div>
            ))}
          </div>
        )}
        {q.length > 1 && results.length === 0 && <div style={{ padding: '32px 20px', textAlign: 'center', color: t.textMuted, fontSize: 14 }}>Keine Ergebnisse für »{q}«</div>}
        {q.length === 0 && (
          <div style={{ padding: '16px 20px 20px' }}>
            <p style={{ fontSize: 11, color: t.textLight, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Kategorien</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {CATEGORIES.filter((c) => c !== 'Alle').map((c) => (
                <button key={c} onClick={() => setQ(c)} style={{ background: t.pill.bg, color: t.pill.color, border: 'none', padding: '6px 14px', borderRadius: 20, fontSize: 12, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>{c}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
