// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxtjs/i18n',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
  ],

  ssr: true,
  devtools: { enabled: true },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#0f172a' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/icons/icon-192x192.png' },
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
  },

  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || '',
    apiSecret: process.env.API_SECRET || '',
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
      authBaseUrl: process.env.NUXT_PUBLIC_AUTH_BASE_URL || 'http://localhost:3001',
      appName: process.env.NUXT_PUBLIC_APP_NAME || 'Enterprise Platform',
      appUrl: process.env.NUXT_PUBLIC_APP_URL || 'http://localhost:3000',
      defaultLocale: 'en',
      enableSeo: process.env.NUXT_PUBLIC_ENABLE_SEO !== 'false',
      // AI configuration — injected at runtime, never baked into the image
      aiBaseUrl: process.env.NUXT_PUBLIC_AI_BASE_URL || '',
      aiDefaultModel: process.env.NUXT_PUBLIC_AI_DEFAULT_MODEL || 'gpt-4o',
      aiDefaultProvider: process.env.NUXT_PUBLIC_AI_DEFAULT_PROVIDER || 'openai',
      mcpServerUrl: process.env.NUXT_PUBLIC_MCP_SERVER_URL || '',
    },
  },

  routeRules: {
    '/': { prerender: true },
    '/about': { prerender: true },
    '/contact': { prerender: true },
    '/auth/**': { ssr: true, robots: false },
    '/dashboard/**': { ssr: false, robots: false },
    '/api/**': { ssr: false },
  },
  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2025-01-01',

  nitro: {
    compressPublicAssets: true,
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },

  fonts: {
    families: [
      { name: 'Inter', provider: 'google' },
    ],
  },

  i18n: {
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'de', language: 'de-DE', name: 'Deutsch', file: 'de.json' },
    ],
    defaultLocale: 'en',
    langDir: '../locales/',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
  },

  image: {
    quality: 80,
    format: ['webp', 'jpeg'],
  },

  robots: {
    disallow: ['/dashboard', '/auth'],
  },

  sitemap: {
    strictNuxtContentPaths: false,
  },
})
