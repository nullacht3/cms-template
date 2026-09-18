'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Theme, Post } from '@/lib/types'

function Chip({ label, t, small }: { label: string; t: Theme; small?: boolean }) {
  return (
    <span style={{
      background: t.tag.bg, color: t.tag.color,
      fontSize: small ? 10 : 11, fontWeight: 600,
      letterSpacing: '0.08em', textTransform: 'uppercase' as const,
      padding: small ? '2px 7px' : '3px 9px',
      borderRadius: 0, fontFamily: "'DM Sans', sans-serif",
    }}>{label}</span>
  )
}

type Size = 'large' | 'medium' | 'small' | 'featured'

export function PostCard({ post, t, featured = false, size = 'medium' }: { post: Post; t: Theme; featured?: boolean; size?: Size }) {
  const [hovered, setHovered] = useState(false)
  const router = useRouter()
  const slug = post.slug || `artikel-${post.id}`
  const go = () => router.push(`/${slug}`)

  // ── FEATURED (2-col hero) ──────────────────────────────────────────
  if (featured) {
    return (
      <div
        className="featured-card"
        onClick={go}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, background: t.surface, overflow: 'hidden', boxShadow: hovered ? t.shadowHover : t.shadow, cursor: 'pointer', transition: 'box-shadow 0.3s', border: `1px solid ${t.border}` }}
      >
        <div style={{ overflow: 'hidden' }}>
          <img src={post.photo} alt="" style={{ width: '100%', height: '100%', minHeight: 340, objectFit: 'cover', display: 'block', transition: 'transform 0.55s ease', transform: hovered ? 'scale(1.04)' : 'scale(1)' }} />
        </div>
        <div className="featured-content" style={{ padding: '48px 48px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 20 }}>
            <Chip label={post.tag} t={t} />
            <span style={{ fontSize: 11, color: t.textLight, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif" }}>{post.category}</span>
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 'clamp(24px,2.6vw,34px)', fontWeight: 600, lineHeight: 1.2, color: t.text, marginBottom: 18, letterSpacing: '-0.01em' }}>{post.title}</h2>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: t.textMuted, marginBottom: 28 }}>{post.excerpt}</p>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: t.textLight }}>{post.date}</span>
            <span style={{ fontSize: 12, color: t.borderLight }}>·</span>
            <span style={{ fontSize: 12, color: t.textLight }}>{post.readTime} Lesezeit</span>
            <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 600, color: t.text, fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.05em' }}>Lesen →</span>
          </div>
        </div>
      </div>
    )
  }

  // ── LARGE (title above image, info bar below) ──────────────────────
  if (size === 'large') {
    return (
      <div
        onClick={go}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        {/* Meta + Title — above the image */}
        <div style={{ marginBottom: 14 }}>
          <Chip label={post.tag} t={t} />
          <h3 style={{
            fontFamily: "'Cormorant Garant', serif",
            fontSize: 'clamp(22px, 2.2vw, 30px)',
            fontWeight: 600,
            lineHeight: 1.2,
            color: t.text,
            marginTop: 12,
            letterSpacing: '-0.02em',
            transition: 'opacity 0.15s',
            opacity: hovered ? 0.7 : 1,
          }}>{post.title}</h3>
        </div>

        {/* Image */}
        <div style={{ overflow: 'hidden', flex: '0 0 auto' }}>
          <img
            src={post.photo}
            alt=""
            style={{ width: '100%', height: 280, objectFit: 'cover', display: 'block', transition: 'transform 0.55s ease', transform: hovered ? 'scale(1.04)' : 'scale(1)' }}
          />
        </div>

        {/* Info bar below image */}
        <div style={{ background: t.surface, borderBottom: `1px solid ${t.border}`, padding: '10px 0', display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: t.textLight, fontFamily: "'DM Sans', sans-serif" }}>{post.date}</span>
          <span style={{ fontSize: 11, color: t.borderLight }}>·</span>
          <span style={{ fontSize: 11, color: t.textLight, fontFamily: "'DM Sans', sans-serif" }}>{post.readTime} Lesezeit</span>
        </div>
      </div>
    )
  }

  // ── SMALL (horizontal row — stacked in right column) ───────────────
  if (size === 'small') {
    return (
      <div
        onClick={go}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ display: 'flex', gap: 16, padding: '16px 0', borderBottom: `1px solid ${t.borderLight}`, cursor: 'pointer' }}
      >
        <div style={{ flexShrink: 0, overflow: 'hidden' }}>
          <img src={post.photo} alt="" style={{ width: 88, height: 68, objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease', transform: hovered ? 'scale(1.06)' : 'scale(1)' }} />
        </div>
        <div style={{ minWidth: 0 }}>
          <Chip label={post.tag} t={t} small />
          <h4 style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 15, fontWeight: 600, lineHeight: 1.35, color: t.text, marginTop: 7, letterSpacing: '-0.01em', opacity: hovered ? 0.7 : 1, transition: 'opacity 0.15s' }}>{post.title}</h4>
          <span style={{ fontSize: 11, color: t.textLight, marginTop: 5, display: 'block', fontFamily: "'DM Sans', sans-serif" }}>{post.date}</span>
        </div>
      </div>
    )
  }

  // ── MEDIUM (standard grid card) ────────────────────────────────────
  return (
    <div
      onClick={go}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: t.surface, overflow: 'hidden', border: `1px solid ${t.border}`, cursor: 'pointer', transition: 'box-shadow 0.25s', boxShadow: hovered ? t.shadowHover : 'none', display: 'flex', flexDirection: 'column' }}
    >
      <div style={{ overflow: 'hidden' }}>
        <img src={post.photo} loading="lazy" alt="" style={{ width: '100%', aspectRatio: '3/2', objectFit: 'cover', display: 'block', transition: 'transform 0.5s ease', transform: hovered ? 'scale(1.04)' : 'scale(1)' }} />
      </div>
      <div style={{ padding: '18px 20px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 10 }}>
          <Chip label={post.tag} t={t} small />
        </div>
        <h3 style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 'clamp(16px,1.5vw,20px)', fontWeight: 600, lineHeight: 1.3, color: t.text, marginBottom: 10, letterSpacing: '-0.01em', flex: 1, opacity: hovered ? 0.75 : 1, transition: 'opacity 0.15s' }}>{post.title}</h3>
        <p style={{ fontSize: 13, lineHeight: 1.65, color: t.textMuted, marginBottom: 14 }}>{post.excerpt}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 12, borderTop: `1px solid ${t.borderLight}` }}>
          <span style={{ fontSize: 11, color: t.textLight, fontFamily: "'DM Sans', sans-serif" }}>{post.date}</span>
          <span style={{ fontSize: 11, color: t.borderLight }}>·</span>
          <span style={{ fontSize: 11, color: t.textLight, fontFamily: "'DM Sans', sans-serif" }}>{post.readTime}</span>
        </div>
      </div>
    </div>
  )
}
