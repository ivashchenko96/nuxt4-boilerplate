import { resolveTenantFromHostname } from '~~/shared/utils'

export default defineNuxtRouteMiddleware(async () => {
  const tenantStore = useTenantStore()

  if (tenantStore.current) return

  const requestURL = useRequestURL()
  const slug = resolveTenantFromHostname(requestURL.hostname)

  tenantStore.setTenant({
    id: slug,
    slug,
    name: slug === 'default' ? 'Default Organization' : `${slug} Organization`,
    branding: {
      primaryColor: '#6366f1',
      appName: 'Enterprise Platform',
    },
    config: {
      enabledModules: ['users', 'reports', 'settings'],
      features: {
        analytics: true,
        export: true,
        api_access: slug !== 'default',
      },
    },
  })
})
