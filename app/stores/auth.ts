import { defineStore } from 'pinia'
import type { User, AuthTokens } from '~~/shared/types'

const TOKEN_KEY = 'auth_access_token'
const REFRESH_KEY = 'auth_refresh_token'

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
  }

  function clearAuth() {
    user.value = null
    tokens.value = null
    if (import.meta.client) {
      sessionStorage.removeItem(TOKEN_KEY)
      sessionStorage.removeItem(REFRESH_KEY)
    }
  }

  function loadTokensFromStorage() {
    if (!import.meta.client) return
    const accessToken = sessionStorage.getItem(TOKEN_KEY)
    const refreshToken = sessionStorage.getItem(REFRESH_KEY)
    if (accessToken && refreshToken) {
      tokens.value = {
        accessToken,
        refreshToken,
        expiresAt: 0,
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
