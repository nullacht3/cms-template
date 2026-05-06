export type Theme = {
  bg: string
  surface: string
  surfaceHover: string
  border: string
  borderLight: string
  text: string
  textMuted: string
  textLight: string
  accent: string
  accentLight: string
  navBg: string
  shadow: string
  shadowHover: string
  tag: { bg: string; color: string }
  pill: { bg: string; color: string; activeBg: string; activeColor: string }
  separator: string
  bodyClass: string
}

export type Post = {
  id: number
  category: string
  tag: string
  title: string
  excerpt: string
  readTime: string
  date: string
  featured: boolean
  type: 'artikel' | 'liste' | 'interview'
  photo: string
  slug?: string
}

export type Article = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  cover_image: string | null
  category: string | null
  tags: string[] | null
  published: boolean
  published_at: string | null
  created_at: string
}
