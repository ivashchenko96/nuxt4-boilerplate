import type { AuthTokens, User } from '~~/shared/types'

interface AuthService {
  login: (credentials: { email: string, password: string }) => Promise<{ user: User, tokens: AuthTokens }>
  logout: () => Promise<void>
  refreshToken: (token: string) => Promise<AuthTokens>
  getProfile: () => Promise<User>
}

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()
  const authBaseUrl = config.public.authBaseUrl as string

  const authService: AuthService = {
    async login(credentials) {
      const response = await fetch(`${authBaseUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })
      if (!response.ok) {
        const err = await response.json().catch(() => ({ message: 'Login failed' })) as { message?: string }
        throw new Error(err.message || 'Login failed')
      }
      return response.json() as Promise<{ user: User, tokens: AuthTokens }>
    },

    async logout() {
      const authStore = useAuthStore()
      const token = authStore.tokens?.accessToken
      if (!token) return
      await fetch(`${authBaseUrl}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }).catch(() => {})
    },

    async refreshToken(refreshToken: string) {
      const response = await fetch(`${authBaseUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      })
      if (!response.ok) throw new Error('Token refresh failed')
      return response.json() as Promise<AuthTokens>
    },

    async getProfile() {
      const authStore = useAuthStore()
      const token = authStore.tokens?.accessToken
      const response = await fetch(`${authBaseUrl}/auth/profile`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      if (!response.ok) throw new Error('Failed to fetch profile')
      return response.json() as Promise<User>
    },
  }

  const authStore = useAuthStore()
  authStore.loadTokensFromStorage()

  if (authStore.tokens?.accessToken) {
    try {
      const user = await authService.getProfile()
      authStore.setUser(user)
    }
    catch {
      authStore.clearAuth()
    }
  }

  return {
    provide: {
      authService,
    },
  }
})
