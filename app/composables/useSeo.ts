interface SeoOptions {
  title: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article'
  noIndex?: boolean
}

export function useSeo(options: SeoOptions) {
  const config = useRuntimeConfig()
  const route = useRoute()

  const appName = config.public.appName as string
  const appUrl = config.public.appUrl as string
  const enableSeo = config.public.enableSeo

  if (!enableSeo) return

  const fullTitle = options.title ? `${options.title} | ${appName}` : appName
  const canonicalUrl = options.url || `${appUrl}${route.path}`
  const ogImage = options.image || `${appUrl}/og-image.jpg`

  useSeoMeta({
    title: fullTitle,
    ogTitle: fullTitle,
    description: options.description,
    ogDescription: options.description,
    ogImage,
    ogUrl: canonicalUrl,
    ogType: options.type || 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: fullTitle,
    twitterDescription: options.description,
    twitterImage: ogImage,
    robots: options.noIndex ? 'noindex, nofollow' : 'index, follow',
  })

  useHead({
    link: [
      { rel: 'canonical', href: canonicalUrl },
    ],
  })
}
