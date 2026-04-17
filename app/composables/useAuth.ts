import { useAuthStore } from '~/stores/auth'
import type { AuthTokens, User } from '~~/shared/types'

interface AuthService {
  login: (credentials: { email: string, password: string }) => Promise<{ user: User, tokens: AuthTokens }>
  logout: () => Promise<void>
  refreshToken: (token: string) => Promise<AuthTokens>
  getProfile: () => Promise<User>
}

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()
  const localePath = useLocalePath()

  async function login(email: string, password: string) {
    authStore.isLoading = true
    authStore.error = null
    try {
      const { $authService } = useNuxtApp()
      const result = await ($authService as AuthService).login({ email, password })
      authStore.setTokens(result.tokens)
      authStore.setUser(result.user)
      await router.push(localePath('/dashboard'))
    }
    catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed'
      authStore.error = message
      throw err
    }
    finally {
      authStore.isLoading = false
    }
  }

  async function logout() {
    try {
      const { $authService } = useNuxtApp()
      await ($authService as AuthService).logout()
    }
    catch {
      // Ignore logout errors
    }
    finally {
      authStore.clearAuth()
      await router.push(localePath('/auth/login'))
    }
  }

  async function refreshTokens() {
    const refreshToken = authStore.tokens?.refreshToken
    if (!refreshToken) throw new Error('No refresh token')
    const { $authService } = useNuxtApp()
    const result = await ($authService as AuthService).refreshToken(refreshToken)
    authStore.setTokens(result)
  }

  return {
    user: computed(() => authStore.user),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    isLoading: computed(() => authStore.isLoading),
    error: computed(() => authStore.error),
    hasRole: authStore.hasRole,
    hasPermission: authStore.hasPermission,
    login,
    logout,
    refreshTokens,
  }
}
