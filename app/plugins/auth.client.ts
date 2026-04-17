import type { AuthTokens, User } from '~~/shared/types'

interface AuthService {
  login: (credentials: { email: string, password: string }) => Promise<{ user: User, tokens: AuthTokens }>
  logout: () => Promise<void>
  refreshToken: (token: string) => Promise<AuthTokens>
  getProfile: () => Promise<User>
}

function createMockTokens(seed: string): AuthTokens {
  const expiresAt = Date.now() + 1000 * 60 * 60
  const payload = btoa(JSON.stringify({ seed, exp: Math.floor(expiresAt / 1000) }))
  return {
    accessToken: `mock.${payload}.sig`,
    refreshToken: `mock-refresh.${payload}.sig`,
    expiresAt,
  }
}

function createMockUser(email: string): User {
  const [namePart = 'Workspace'] = email.split('@')
  const displayName = namePart
    .split(/[._-]/g)
    .filter(Boolean)
    .map(chunk => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(' ') || 'Workspace User'

  return {
    id: crypto.randomUUID(),
    email: email || 'demo@example.com',
    name: displayName,
    roles: ['admin'],
    permissions: ['dashboard:view', 'users:view', 'reports:view', 'settings:view'],
  }
}

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()
  const authBaseUrl = config.public.authBaseUrl as string
  const authProvider = String(config.public.authProvider || 'mock')

  const mockAuthService: AuthService = {
    async login(credentials) {
      const email = credentials.email || 'demo@example.com'
      return {
        user: createMockUser(email),
        tokens: createMockTokens(email),
      }
    },

    async logout() {},

    async refreshToken(refreshToken: string) {
      return createMockTokens(refreshToken)
    },

    async getProfile() {
      const authStore = useAuthStore()
      if (authStore.user) {
        return authStore.user
      }
      return createMockUser('demo@example.com')
    },
  }

  const apiAuthService: AuthService = {
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
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error('Failed to fetch profile')
      return response.json() as Promise<User>
    },
  }

  const authService = authProvider === 'api' ? apiAuthService : mockAuthService

  const authStore = useAuthStore()
  authStore.loadTokensFromStorage()

  if (authStore.tokens?.accessToken && !authStore.user) {
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
