<template>
  <header class="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center px-4 gap-4">
    <UButton
      variant="ghost"
      size="sm"
      :icon="uiStore.sidebarCollapsed ? 'i-heroicons-bars-3-bottom-left' : 'i-heroicons-bars-3'"
      :aria-label="$t('common.toggleSidebar')"
      class="hidden md:flex"
      @click="uiStore.toggleSidebarCollapsed()"
    />
    <UButton
      variant="ghost"
      size="sm"
      icon="i-heroicons-bars-3"
      :aria-label="$t('common.toggleSidebar')"
      class="md:hidden"
      @click="uiStore.toggleSidebar()"
    />

    <div class="flex-1">
      <h1 class="text-lg font-semibold text-gray-900 dark:text-white">
        {{ pageTitle }}
      </h1>
    </div>

    <div class="flex items-center gap-2">
      <SharedColorModeToggle />
      <SharedLanguageSwitcher />
      <UButton
        variant="ghost"
        size="sm"
        icon="i-heroicons-bell"
        :aria-label="$t('common.notifications')"
      />
      <UAvatar
        :alt="user?.name"
        size="sm"
        class="cursor-pointer bg-brand-600"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
const uiStore = useUiStore()
const { user } = useAuth()
const route = useRoute()
const { t } = useI18n()

const pageTitle = computed(() => {
  const meta = route.meta.title as string | undefined
  return meta ? t(meta) : t('nav.dashboard')
})
</script>
