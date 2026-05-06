'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Nav } from '@/components/Nav'
import { PostCard } from '@/components/PostCard'
import { Footer } from '@/components/Footer'
import { NewsletterForm } from '@/components/NewsletterForm'
import { useTheme } from '@/context/ThemeContext'
import { POSTS } from '@/lib/themes'
import { getArticles } from '@/lib/getArticles'
import type { Post } from '@/lib/types'

export default function HomePage() {
  const { t } = useTheme()
  const [posts, setPosts] = useState<Post[]>(POSTS)

  useEffect(() => {
    getArticles().then(setPosts)
  }, [])

  const featured = posts.find((p) => p.featured)
  const rest = posts.filter((p) => !p.featured)

  return (
    <>
      <Nav />
      <div>
        {/* Full-width hero */}
        <div style={{ position: 'relative', width: '100%', height: '92vh', minHeight: 540, maxHeight: 860, overflow: 'hidden' }}>
          <img
            src="https://images.unsplash.com/photo-1552693673-1bf958298935?auto=format&fit=crop&w=1800&q=85"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }}
            alt=""
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(26,36,32,0.15) 0%, rgba(26,36,32,0.55) 60%, rgba(26,36,32,0.82) 100%)' }} />
          <div className="hero-inner" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 64px 64px' }}>
            <div className="hero-content" style={{ maxWidth: 1140, margin: '0 auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 40 }}>
              <div>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 16 }}>Wissenschaft · Ästhetik · München</p>
                <h1 style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 'clamp(32px, 5vw, 62px)', fontWeight: 300, lineHeight: 1.1, letterSpacing: '-0.02em', color: '#f4f0ea', marginBottom: 0 }}>
                  Ästhetische Medizin<br />
                  <em style={{ fontStyle: 'italic', fontWeight: 300 }}>mit wissenschaftlichem Anspruch.</em>
                </h1>
              </div>
              <div className="hero-right" style={{ flexShrink: 0, maxWidth: 280, paddingBottom: 8 }}>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, marginBottom: 20, textAlign: 'right' }}>
                  Fundiertes Fachwissen, kuratierte Listen und Interviews für alle, die Ästhetik wirklich verstehen wollen.
                </p>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Link href="/kategorien" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(8px)', color: '#fff', padding: '10px 22px', borderRadius: 6, fontSize: 12, fontWeight: 500, letterSpacing: '0.06em', fontFamily: "'DM Sans', sans-serif", textDecoration: 'none' }}>Alle Artikel →</Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="page-padding" style={{ maxWidth: 1140, margin: '0 auto', padding: '60px 28px 80px' }}>
          {featured && (
            <div style={{ marginBottom: 52 }}>
              <p style={{ fontSize: 11, color: t.textLight, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20 }}>— Empfohlen</p>
              <PostCard post={featured} t={t} featured />
            </div>
          )}

          <div>
            <p style={{ fontSize: 11, color: t.textLight, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20 }}>— Aktuelle Beiträge</p>
            <div className="post-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {rest.map((p) => <PostCard key={p.slug || p.id} post={p} t={t} />)}
            </div>
          </div>

          <NewsletterForm />
        </div>
      </div>
      <Footer />
    </>
  )
}
