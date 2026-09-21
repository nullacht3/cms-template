import type { Metadata } from 'next'
import { cache } from 'react'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ArticlePageClient } from '@/components/ArticlePageClient'
import { toPost } from '@/lib/getArticles'
import { buildArticleJsonLd } from '@/lib/articleSeo'

type Props = { params: Promise<{ slug: string }> }

// Shared by generateMetadata and the page, so the article is fetched once per request
const getArticle = cache(async (slug: string) => {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('articles')
      .select('title, slug, excerpt, seo_title, meta_description, cover_image, category, tags, published_at, updated_at, read_time, is_featured, content')
      .eq('slug', slug)
      .eq('published', true)
      .single()
    return data
  } catch {
    return null
  }
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)

  const title = article?.seo_title || article?.title || 'Der Ästhet'
  const description = article?.meta_description || article?.excerpt || 'Das Magazin für ästhetische Medizin'
  const image = article?.cover_image || 'https://deraesthet.de/og-default.jpg'

  return {
    title: `${title} | Der Ästhet`,
    description,
    alternates: { canonical: `https://deraesthet.de/${slug}` },
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
  const article = await getArticle(slug)
  if (!article) notFound()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildArticleJsonLd(article)).replace(/</g, '\\u003c') }}
      />
      <ArticlePageClient
        slug={slug}
        initialPost={toPost(article, 0)}
        initialHtml={article.content || undefined}
      />
    </>
  )
}
