import { defineStore } from 'pinia'
import type { Tenant } from '~~/shared/types'

export const useTenantStore = defineStore('tenant', () => {
  const current = ref<Tenant | null>(null)
  const isLoading = ref(false)

  const tenantId = computed(() => current.value?.id ?? 'default')
  const tenantName = computed(() => current.value?.name ?? 'Default')
  const branding = computed(() => current.value?.branding)

  function setTenant(tenant: Tenant) {
    current.value = tenant
  }

  function isFeatureEnabled(feature: string): boolean {
    return current.value?.config.features[feature] ?? false
  }

  function isModuleEnabled(moduleId: string): boolean {
    return current.value?.config.enabledModules.includes(moduleId) ?? true
  }

  return {
    current,
    isLoading,
    tenantId,
    tenantName,
    branding,
    setTenant,
    isFeatureEnabled,
    isModuleEnabled,
  }
})
