import { useAuthStore } from '~/stores/auth'
import { useTenantStore } from '~/stores/tenant'
import type { AuthTokens } from '~~/shared/types'

interface FetchOptions extends RequestInit {
  query?: Record<string, string | number | boolean>
}

export function useApiClient() {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  const tenantStore = useTenantStore()
  // localePath extracted at top level to be safe on both server and client
  const localePath = useLocalePath()

  const baseUrl = config.public.apiBaseUrl as string

  async function request<T>(endpoint: string, options: FetchOptions = {}): Promise<T | undefined> {
    const { query, ...fetchOptions } = options

    const url = new URL(`${baseUrl}${endpoint}`)
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        url.searchParams.set(key, String(value))
      })
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(fetchOptions.headers as Record<string, string>),
    }

    if (authStore.tokens?.accessToken) {
      headers['Authorization'] = `Bearer ${authStore.tokens.accessToken}`
    }

    if (tenantStore.tenantId && tenantStore.tenantId !== 'default') {
      headers['X-Tenant-ID'] = tenantStore.tenantId
    }

    const response = await fetch(url.toString(), {
      ...fetchOptions,
      headers,
    })

    if (response.status === 401) {
      try {
        const refreshToken = authStore.tokens?.refreshToken
        if (refreshToken) {
          const { $authService } = useNuxtApp()
          const newTokens = await ($authService as { refreshToken: (t: string) => Promise<AuthTokens> }).refreshToken(refreshToken)
          authStore.setTokens(newTokens)
          headers['Authorization'] = `Bearer ${newTokens.accessToken}`
          const retryResponse = await fetch(url.toString(), { ...fetchOptions, headers })
          if (!retryResponse.ok) throw new Error(`HTTP ${retryResponse.status}`)
          return retryResponse.json() as Promise<T>
        }
      }
      catch {
        authStore.clearAuth()
        navigateTo(localePath('/auth/login'))
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})) as { message?: string }
      throw new Error(errorData.message || `HTTP ${response.status}`)
    }

    if (response.status === 204) return undefined
    return response.json() as Promise<T>
  }

  return {
    get: <T>(endpoint: string, options?: FetchOptions) => request<T>(endpoint, { ...options, method: 'GET' }),
    post: <T>(endpoint: string, data?: unknown, options?: FetchOptions) =>
      request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(data) }),
    put: <T>(endpoint: string, data?: unknown, options?: FetchOptions) =>
      request<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(data) }),
    patch: <T>(endpoint: string, data?: unknown, options?: FetchOptions) =>
      request<T>(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(data) }),
    delete: <T>(endpoint: string, options?: FetchOptions) => request<T>(endpoint, { ...options, method: 'DELETE' }),
  }
}
