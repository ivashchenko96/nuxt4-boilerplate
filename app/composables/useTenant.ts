import { useTenantStore } from '~/stores/tenant'
import { resolveTenantFromHostname } from '~~/shared/utils'

export function useTenant() {
  const tenantStore = useTenantStore()
  const requestURL = useRequestURL()

  const tenantSlug = computed(() => {
    if (import.meta.client) {
      return resolveTenantFromHostname(window.location.hostname)
    }
    return resolveTenantFromHostname(requestURL.hostname)
  })

  return {
    tenant: computed(() => tenantStore.current),
    tenantId: computed(() => tenantStore.tenantId),
    tenantName: computed(() => tenantStore.tenantName),
    branding: computed(() => tenantStore.branding),
    tenantSlug,
    isFeatureEnabled: tenantStore.isFeatureEnabled,
    isModuleEnabled: tenantStore.isModuleEnabled,
  }
}
