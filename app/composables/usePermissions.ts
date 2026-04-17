import { useAuthStore } from '~/stores/auth'

export function usePermissions() {
  const authStore = useAuthStore()

  function can(permission: string): boolean {
    return authStore.hasPermission(permission)
  }

  function canAny(permissions: string[]): boolean {
    return permissions.some(p => can(p))
  }

  function canAll(permissions: string[]): boolean {
    return permissions.every(p => can(p))
  }

  function is(role: string): boolean {
    return authStore.hasRole(role)
  }

  function isAny(roles: string[]): boolean {
    return authStore.hasAnyRole(roles)
  }

  return {
    can,
    canAny,
    canAll,
    is,
    isAny,
  }
}
