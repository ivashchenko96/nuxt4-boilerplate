<template>
  <aside
    :class="[
      'flex flex-col bg-gray-900 dark:bg-gray-950 text-white transition-all duration-300',
      uiStore.sidebarOpen ? 'w-64' : 'w-0 overflow-hidden',
      'md:relative fixed inset-y-0 left-0 z-40',
      uiStore.sidebarCollapsed ? 'md:w-16' : 'md:w-64',
    ]"
    aria-label="Dashboard sidebar navigation"
  >
    <div class="h-16 flex items-center px-4 border-b border-gray-800">
      <NuxtLink
        :to="localePath('/dashboard')"
        class="flex items-center gap-3 min-w-0"
      >
        <UIcon
          name="i-heroicons-building-office-2"
          class="w-7 h-7 text-brand-400 flex-shrink-0"
        />
        <span
          v-if="!uiStore.sidebarCollapsed"
          class="font-bold text-lg truncate"
        >{{ config.public.appName }}</span>
      </NuxtLink>
    </div>

    <nav
      class="flex-1 px-3 py-4 space-y-1 overflow-y-auto"
      aria-label="Sidebar navigation"
    >
      <template
        v-for="item in navItems"
        :key="item.label"
      >
        <NuxtLink
          :to="localePath(item.to)"
          :class="[
            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group',
            isActive(item.to)
              ? 'bg-brand-600 text-white'
              : 'text-gray-400 hover:bg-gray-800 hover:text-white',
          ]"
          :aria-current="isActive(item.to) ? 'page' : undefined"
        >
          <UIcon
            :name="item.icon"
            class="w-5 h-5 flex-shrink-0"
          />
          <span
            v-if="!uiStore.sidebarCollapsed"
            class="truncate"
          >{{ item.label }}</span>
        </NuxtLink>
      </template>
    </nav>

    <div class="border-t border-gray-800 p-3">
      <div
        v-if="!uiStore.sidebarCollapsed"
        class="flex items-center gap-3 px-3 py-2"
      >
        <UAvatar
          :alt="user?.name"
          size="sm"
          class="bg-brand-600 flex-shrink-0"
        />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-white truncate">
            {{ user?.name }}
          </p>
          <p class="text-xs text-gray-400 truncate">
            {{ user?.email }}
          </p>
        </div>
        <UButton
          variant="ghost"
          size="xs"
          icon="i-heroicons-arrow-right-on-rectangle"
          :aria-label="$t('auth.logout')"
          @click="logout"
        />
      </div>
      <UButton
        v-else
        variant="ghost"
        size="sm"
        icon="i-heroicons-arrow-right-on-rectangle"
        :aria-label="$t('auth.logout')"
        class="w-full justify-center"
        @click="logout"
      />
    </div>
  </aside>

  <Transition
    enter-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="uiStore.sidebarOpen"
      class="md:hidden fixed inset-0 bg-black/60 z-30"
      aria-hidden="true"
      @click="uiStore.sidebarOpen = false"
    />
  </Transition>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const localePath = useLocalePath()
const route = useRoute()
const uiStore = useUiStore()
const { user, logout } = useAuth()
const { t } = useI18n()

const navItems = computed(() => [
  { to: '/dashboard', icon: 'i-heroicons-home', label: t('nav.dashboard') },
  { to: '/dashboard/ai', icon: 'i-heroicons-sparkles', label: t('nav.ai') },
  { to: '/dashboard/users', icon: 'i-heroicons-users', label: t('nav.users') },
  { to: '/dashboard/reports', icon: 'i-heroicons-chart-bar', label: t('nav.reports') },
  { to: '/dashboard/settings', icon: 'i-heroicons-cog-6-tooth', label: t('nav.settings') },
])

function isActive(path: string): boolean {
  const fullPath = localePath(path)
  if (path === '/dashboard') {
    return route.path === fullPath
  }
  return route.path.startsWith(fullPath)
}
</script>
