'use client'
import Link from 'next/link'
import { Nav } from '@/components/Nav'
import { PostCard } from '@/components/PostCard'
import { Footer } from '@/components/Footer'
import { NewsletterForm } from '@/components/NewsletterForm'
import { useTheme } from '@/context/ThemeContext'
import type { Post } from '@/lib/types'
import type { HomepageSettings } from '@/lib/siteSettings'
import { CATEGORY_ORDER, CATEGORY_DISPLAY } from '@/lib/themes'

type Props = {
  posts: Post[]
  hero: HomepageSettings
}

// Elle-style: big bold category section heading
function CategoryHeading({ name, slug, t }: { name: string; slug: string; t: any }) {
  return (
    <div style={{ borderTop: `3px solid ${t.text}`, paddingTop: 14, marginBottom: 28 }}>
      <Link
        href={`/kategorien?cat=${slug}`}
        style={{ textDecoration: 'none', display: 'inline-block' }}
      >
        <h2 style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 'clamp(30px, 4.5vw, 52px)',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          textTransform: 'uppercase',
          color: t.text,
          lineHeight: 1,
          transition: 'color 0.15s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = t.accent)}
        onMouseLeave={(e) => (e.currentTarget.style.color = t.text)}
        >{name}</h2>
      </Link>
    </div>
  )
}

// Varied grid based on how many posts in this category
function CategoryGrid({ posts, t }: { posts: Post[]; t: any }) {
  if (posts.length === 0) return null

  if (posts.length === 1) {
    return (
      <div style={{ maxWidth: 560 }}>
        <PostCard post={posts[0]} t={t} size="large" />
      </div>
    )
  }

  if (posts.length === 2) {
    return (
      <div className="elle-grid-2" style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 24 }}>
        <PostCard post={posts[0]} t={t} size="large" />
        <PostCard post={posts[1]} t={t} size="medium" />
      </div>
    )
  }

  // 3+ posts: large left (spans full height) + small stacked right
  const [first, ...rest] = posts
  const shown = rest.slice(0, 3)
  return (
    <div className="elle-grid-main" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
      {/* Large card on left */}
      <PostCard post={first} t={t} size="large" />
      {/* Stacked small cards on right */}
      <div>
        {shown.map((p) => (
          <PostCard key={p.id} post={p} t={t} size="small" />
        ))}
      </div>
    </div>
  )
}

export function HomeClient({ posts, hero }: Props) {
  const { t } = useTheme()

  // Group posts by category, in the defined order
  const sections = CATEGORY_ORDER.map((cat) => ({
    cat,
    slug: cat === 'Behandlungen' ? 'treatments'
        : cat === 'Trends' ? 'trends'
        : cat === 'Wissen & Forschung' ? 'wissen'
        : 'sprechstunde',
    display: CATEGORY_DISPLAY[cat] || cat,
    posts: posts.filter((p) => p.category === cat),
  })).filter((s) => s.posts.length > 0)

  return (
    <>
      <Nav />
      <div>
        {/* Full-width hero */}
        <div style={{ position: 'relative', width: '100%', height: '92vh', minHeight: 540, maxHeight: 860, overflow: 'hidden' }}>
          <img
            src={hero.hero_image}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }}
            alt=""
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(26,20,16,0.10) 0%, rgba(26,20,16,0.52) 55%, rgba(26,20,16,0.82) 100%)' }} />
          <div className="hero-inner" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 64px 64px' }}>
            <div className="hero-content" style={{ maxWidth: 1140, margin: '0 auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 40 }}>
              <div>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 16, fontFamily: "'DM Sans', sans-serif" }}>{hero.hero_tagline}</p>
                <h1 style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 'clamp(32px, 5vw, 66px)', fontWeight: 300, lineHeight: 1.08, letterSpacing: '-0.02em', color: '#f4f0ea', marginBottom: 0 }}>
                  {hero.hero_title}<br />
                  <em style={{ fontStyle: 'italic', fontWeight: 300 }}>{hero.hero_subtitle}</em>
                </h1>
              </div>
              <div className="hero-right" style={{ flexShrink: 0, maxWidth: 280, paddingBottom: 8 }}>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, marginBottom: 20, textAlign: 'right' }}>
                  {hero.hero_description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Link href={hero.hero_button_url || '/kategorien'} style={{ background: '#ffffff', border: 'none', color: '#1a1410', padding: '11px 28px', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif", textDecoration: 'none', display: 'inline-block' }}>
                    {hero.hero_button_text}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category sections */}
        <div className="page-padding" style={{ maxWidth: 1140, margin: '0 auto', padding: '72px 28px 96px' }}>
          {sections.map((section, i) => (
            <section key={section.cat} style={{ marginBottom: i < sections.length - 1 ? 80 : 0 }}>
              <CategoryHeading name={section.display} slug={section.slug} t={t} />
              <CategoryGrid posts={section.posts} t={t} />
            </section>
          ))}

          <NewsletterForm />
        </div>
      </div>
      <Footer />
    </>
  )
}
