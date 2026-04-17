<template>
  <header class="h-16 bg-paper border-b border-soft flex items-center px-6 gap-4">
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
      <h1 class="text-lg md:text-xl font-semibold text-ink font-editorial">
        {{ pageTitle }}
      </h1>
    </div>

    <div class="flex items-center gap-2">
      <SharedColorModeToggle />
      <SharedLanguageSwitcher />
      <!-- AI assistant panel toggle -->
      <UButton
        variant="ghost"
        size="sm"
        icon="i-heroicons-sparkles"
        :class="aiStore.panelOpen ? 'text-brand-600 bg-brand-100' : ''"
        :aria-label="$t('ai.togglePanel')"
        @click="aiStore.panelOpen = !aiStore.panelOpen"
      />
      <!-- Command palette trigger -->
      <UButton
        variant="ghost"
        size="sm"
        icon="i-heroicons-magnifying-glass"
        :aria-label="$t('ai.commandPalette')"
        @click="aiStore.commandPaletteOpen = true"
      />
      <UButton
        variant="ghost"
        size="sm"
        icon="i-heroicons-bell"
        :aria-label="$t('common.notifications')"
      />
      <UAvatar
        :alt="user?.name"
        size="sm"
        class="cursor-pointer bg-brand-500 text-white"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
const uiStore = useUiStore()
const aiStore = useAiStore()
const { user } = useAuth()
const route = useRoute()
const { t } = useI18n()

const pageTitle = computed(() => {
  const meta = route.meta.title as string | undefined
  return meta ? t(meta) : t('nav.dashboard')
})
</script>
