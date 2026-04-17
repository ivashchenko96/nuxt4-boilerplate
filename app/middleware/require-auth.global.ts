export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  const localePath = useLocalePath()
  const normalizedPath = to.path.replace(/^\/(en|de)(?=\/|$)/, '') || '/'
  const isAuthRoute = normalizedPath.startsWith('/auth')

  if (!authStore.isAuthenticated && !isAuthRoute) {
    return navigateTo(localePath('/auth/login'))
  }

  if (authStore.isAuthenticated && isAuthRoute) {
    return navigateTo(localePath('/dashboard'))
  }
})
