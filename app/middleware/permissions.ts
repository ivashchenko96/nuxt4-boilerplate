export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  const requiredPermission = to.meta.permission as string | undefined
  const requiredRole = to.meta.role as string | undefined

  if (requiredPermission && !authStore.hasPermission(requiredPermission)) {
    return createError({ statusCode: 403, message: 'Forbidden' })
  }

  if (requiredRole && !authStore.hasRole(requiredRole)) {
    return createError({ statusCode: 403, message: 'Forbidden' })
  }
})
