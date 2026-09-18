import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ArticlePageClient } from '@/components/ArticlePageClient'

type Props = { params: Promise<{ slug: string }> }

async function getArticleMeta(slug: string) {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('articles')
      .select('title, excerpt, seo_title, meta_description, cover_image')
      .eq('slug', slug)
      .single()
    return data
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleMeta(slug)

  const title = article?.seo_title || article?.title || 'Der Ästhet'
  const description = article?.meta_description || article?.excerpt || 'Das Magazin für ästhetische Medizin'
  const image = article?.cover_image || 'https://deraesthet.de/og-default.jpg'

  return {
    title: `${title} | Der Ästhet`,
    description,
    openGraph: {
      title: `${title} | Der Ästhet`,
      description,
      url: `https://deraesthet.de/${slug}`,
      siteName: 'Der Ästhet',
      images: [{ url: image, width: 1200, height: 630 }],
      type: 'article',
      locale: 'de_DE',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Der Ästhet`,
      description,
      images: [image],
    },
  }
}

export default async function ArtikelPage({ params }: Props) {
  const { slug } = await params
  return <ArticlePageClient slug={slug} />
}
