/**
 * AI provider plugin — client-side only
 *
 * Boots the AI store from local storage and configures the provider
 * base URL from runtime config.
 *
 * The actual AI gateway base URL is injected at runtime via
 * NUXT_PUBLIC_AI_BASE_URL — it is never baked into the build.
 *
 * To swap AI providers, you only need to:
 *   1. Point NUXT_PUBLIC_AI_BASE_URL at a different OpenAI-compatible endpoint.
 *   2. Update NUXT_PUBLIC_AI_DEFAULT_MODEL to the target model ID.
 *
 * For non-OpenAI-compatible providers, replace the fetch logic in
 * `useAiChat.ts` (streamResponse / fetchFullResponse) with a provider-
 * specific adapter while keeping the store interface unchanged.
 */
export default defineNuxtPlugin(() => {
  const aiStore = useAiStore()
  const config = useRuntimeConfig()

  // Hydrate stored conversations and settings
  aiStore.loadFromStorage()

  // Sync env-level provider defaults if not already saved by the user
  const envBaseUrl = config.public.aiBaseUrl as string
  const envModel = config.public.aiDefaultModel as string

  if (envBaseUrl && !aiStore.settings.provider.baseUrl) {
    aiStore.updateProviderConfig({ baseUrl: envBaseUrl })
  }
  if (envModel && aiStore.settings.provider.modelId === 'gpt-4o') {
    aiStore.updateProviderConfig({ modelId: envModel })
  }
})
