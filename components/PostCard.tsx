'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Theme, Post } from '@/lib/types'

function Chip({ label, t, small }: { label: string; t: Theme; small?: boolean }) {
  return (
    <span style={{
      background: t.tag.bg, color: t.tag.color,
      fontSize: small ? 10 : 11, fontWeight: 500,
      letterSpacing: '0.08em', textTransform: 'uppercase' as const,
      padding: small ? '2px 8px' : '3px 10px',
      borderRadius: 4, fontFamily: "'DM Sans', sans-serif",
    }}>{label}</span>
  )
}

function PostImage({ src, ratio = '16/9', t, className = '', style = {} }: { src: string; ratio?: string; t: Theme; className?: string; style?: React.CSSProperties }) {
  const [w, h] = ratio.split('/').map(Number)
  return (
    <div className={className} style={{ width: '100%', paddingBottom: `${h / w * 100}%`, position: 'relative', borderRadius: 8, overflow: 'hidden', background: t.surfaceHover, ...style }}>
      {src && <img src={src} loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} alt="" />}
    </div>
  )
}

export function PostCard({ post, t, featured = false }: { post: Post; t: Theme; featured?: boolean }) {
  const [hovered, setHovered] = useState(false)
  const router = useRouter()
  const slug = post.slug || `artikel-${post.id}`

  if (featured) {
    return (
      <div className="featured-card" onClick={() => router.push(`/artikel/${slug}`)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, background: t.surface, borderRadius: 12, overflow: 'hidden', boxShadow: hovered ? t.shadowHover : t.shadow, cursor: 'pointer', transition: 'box-shadow 0.25s, transform 0.25s', transform: hovered ? 'translateY(-2px)' : 'none' }}>
        <PostImage src={post.photo} ratio="4/3" t={t} className="featured-image" style={{ borderRadius: 0, paddingBottom: '75%' }} />
        <div className="featured-content" style={{ padding: '40px 40px 40px 44px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 20 }}>
            <Chip label={post.tag} t={t} />
            <span style={{ fontSize: 11, color: t.textLight, letterSpacing: '0.04em' }}>{post.category}</span>
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 28, fontWeight: 500, lineHeight: 1.3, color: t.text, marginBottom: 16, letterSpacing: '-0.01em' }}>{post.title}</h2>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: t.textMuted, marginBottom: 24 }}>{post.excerpt}</p>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: t.textLight }}>{post.date}</span>
            <span style={{ fontSize: 12, color: t.textLight }}>·</span>
            <span style={{ fontSize: 12, color: t.textLight }}>{post.readTime} Lesezeit</span>
            <div style={{ marginLeft: 'auto', color: t.accent, fontSize: 13, fontWeight: 500, letterSpacing: '0.03em' }}>Lesen →</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div onClick={() => router.push(`/artikel/${slug}`)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ background: t.surface, borderRadius: 10, overflow: 'hidden', boxShadow: hovered ? t.shadowHover : t.shadow, cursor: 'pointer', transition: 'box-shadow 0.25s, transform 0.25s', transform: hovered ? 'translateY(-2px)' : 'none', display: 'flex', flexDirection: 'column' }}>
      <PostImage src={post.photo} ratio="16/9" t={t} style={{ borderRadius: '10px 10px 0 0' }} />
      <div style={{ padding: '24px 28px 28px' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 14 }}>
          <Chip label={post.tag} t={t} small />
          <span style={{ fontSize: 10, color: t.textLight, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{post.category}</span>
        </div>
        <h3 style={{ fontFamily: "'Cormorant Garant', serif", fontSize: 20, fontWeight: 500, lineHeight: 1.35, color: t.text, marginBottom: 12, letterSpacing: '-0.01em' }}>{post.title}</h3>
        <p style={{ fontSize: 13, lineHeight: 1.65, color: t.textMuted, marginBottom: 20 }}>{post.excerpt}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 16, borderTop: `1px solid ${t.borderLight}` }}>
          <span style={{ fontSize: 11, color: t.textLight }}>{post.date}</span>
          <span style={{ fontSize: 11, color: t.textLight }}>·</span>
          <span style={{ fontSize: 11, color: t.textLight }}>{post.readTime}</span>
        </div>
      </div>
    </div>
  )
}
