import { defineStore } from 'pinia'
import type { User, AuthTokens } from '~~/shared/types'
import { parseJwtPayload } from '~~/shared/utils'

const TOKEN_KEY = 'auth_access_token'
const REFRESH_KEY = 'auth_refresh_token'
const USER_KEY = 'auth_user'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const tokens = ref<AuthTokens | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!tokens.value?.accessToken && !!user.value)

  function hasRole(role: string): boolean {
    return user.value?.roles.includes(role) ?? false
  }

  function hasPermission(permission: string): boolean {
    return user.value?.permissions.includes(permission) ?? false
  }

  function hasAnyRole(roles: string[]): boolean {
    return roles.some(role => hasRole(role))
  }

  function setTokens(newTokens: AuthTokens) {
    tokens.value = newTokens
    if (import.meta.client) {
      sessionStorage.setItem(TOKEN_KEY, newTokens.accessToken)
      sessionStorage.setItem(REFRESH_KEY, newTokens.refreshToken)
    }
  }

  function setUser(newUser: User) {
    user.value = newUser
    if (import.meta.client) {
      sessionStorage.setItem(USER_KEY, JSON.stringify(newUser))
    }
  }

  function clearAuth() {
    user.value = null
    tokens.value = null
    if (import.meta.client) {
      sessionStorage.removeItem(TOKEN_KEY)
      sessionStorage.removeItem(REFRESH_KEY)
      sessionStorage.removeItem(USER_KEY)
    }
  }

  function loadTokensFromStorage() {
    if (!import.meta.client) return
    const accessToken = sessionStorage.getItem(TOKEN_KEY)
    const refreshToken = sessionStorage.getItem(REFRESH_KEY)
    if (accessToken && refreshToken) {
      // Parse expiration from JWT payload
      const payload = parseJwtPayload(accessToken)
      let expiresAt: number
      if (typeof payload?.exp === 'number') {
        expiresAt = payload.exp * 1000
      }
      else {
        // Missing or invalid exp claim: treat token as expired so refresh is triggered
        console.warn('[auth] JWT missing exp claim; treating token as expired for safety')
        expiresAt = Date.now() - 1
      }
      tokens.value = {
        accessToken,
        refreshToken,
        expiresAt,
      }
    }
    const storedUser = sessionStorage.getItem(USER_KEY)
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser) as User
      }
      catch {
        sessionStorage.removeItem(USER_KEY)
      }
    }
  }

  return {
    user,
    tokens,
    isLoading,
    error,
    isAuthenticated,
    hasRole,
    hasPermission,
    hasAnyRole,
    setTokens,
    setUser,
    clearAuth,
    loadTokensFromStorage,
  }
})
