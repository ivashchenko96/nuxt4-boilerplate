export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    const localePath = useLocalePath()
    return navigateTo(localePath('/auth/login'))
  }
})
