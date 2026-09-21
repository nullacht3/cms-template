// Structured data (JSON-LD) for article pages, built from the article's HTML content.

type FaqItem = { question: string; answer: string }

const decode = (s: string) =>
  s
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()

// Reads the FAQ section: an <h2> containing "Fragen" or "FAQ", followed by <h3> questions
// whose answer is everything up to the next <h3>/<h2>.
export function extractFaq(html: string): FaqItem[] {
  const start = html.search(/<h2[^>]*>[^<]*(Fragen|FAQ)[^<]*<\/h2>/i)
  if (start === -1) return []
  const afterHeading = html.slice(start).replace(/^<h2[^>]*>[\s\S]*?<\/h2>/i, '')
  const end = afterHeading.search(/<h2[\s>]/i)
  const section = end === -1 ? afterHeading : afterHeading.slice(0, end)

  const items: FaqItem[] = []
  const re = /<h3[^>]*>(.*?)<\/h3>([\s\S]*?)(?=<h3[\s>]|$)/gi
  let m: RegExpExecArray | null
  while ((m = re.exec(section))) {
    const question = decode(m[1])
    const answer = decode(m[2])
    if (question && answer) items.push({ question, answer })
  }
  return items
}

type ArticleRow = {
  title: string
  slug: string
  excerpt?: string | null
  meta_description?: string | null
  cover_image?: string | null
  published_at?: string | null
  updated_at?: string | null
  content?: string | null
}

export function buildArticleJsonLd(a: ArticleRow) {
  const url = `https://deraesthet.de/${a.slug}`
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Article',
      headline: a.title,
      description: a.meta_description || a.excerpt || undefined,
      image: a.cover_image ? [a.cover_image] : undefined,
      datePublished: a.published_at || undefined,
      dateModified: a.updated_at || a.published_at || undefined,
      mainEntityOfPage: url,
      publisher: { '@type': 'Organization', name: 'Der Ästhet', url: 'https://deraesthet.de' },
    },
  ]

  const faq = a.content ? extractFaq(a.content) : []
  if (faq.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: faq.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    })
  }

  return { '@context': 'https://schema.org', '@graph': graph }
}
