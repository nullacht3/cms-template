'use client'
import type { Theme } from '@/lib/types'

function LogoMark({ height = 32 }: { height?: number }) {
  const w = height * 1.15
  return (
    <svg width={w} height={height} viewBox="0 0 46 40" fill="none">
      <ellipse cx="23" cy="20" rx="21" ry="13" stroke="#3A9BA4" strokeWidth="1.3" fill="none"/>
      <circle cx="23" cy="20" r="5.5" stroke="#3A9BA4" strokeWidth="1.3" fill="none"/>
      <circle cx="23" cy="20" r="2" fill="#3A9BA4"/>
      <path d="M7 15 Q23 6 39 15" stroke="#3A9BA4" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
    </svg>
  )
}

export function Logo({ t, size = 'default' }: { t: Theme; size?: 'default' | 'small' }) {
  const isSmall = size === 'small'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: isSmall ? 8 : 11, cursor: 'pointer' }}>
      <LogoMark height={isSmall ? 24 : 32} />
      <span style={{
        fontFamily: "'Cormorant Garant', serif",
        fontWeight: 500,
        fontSize: isSmall ? 18 : 22,
        letterSpacing: '0.04em',
        color: t.text,
        whiteSpace: 'nowrap',
        lineHeight: 1,
      }}>Der Ästhet</span>
    </div>
  )
}
