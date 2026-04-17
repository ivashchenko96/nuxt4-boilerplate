<template>
  <header class="sticky top-0 z-50 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
    <nav
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
      aria-label="Main navigation"
    >
      <NuxtLink
        :to="localePath('/')"
        class="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-white"
      >
        <UIcon
          name="i-heroicons-building-office-2"
          class="w-7 h-7 text-brand-600"
        />
        {{ config.public.appName }}
      </NuxtLink>

      <div class="hidden md:flex items-center gap-6">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="localePath(item.to)"
          class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
        >
          {{ item.label }}
        </NuxtLink>
      </div>

      <div class="flex items-center gap-3">
        <SharedLanguageSwitcher />
        <SharedColorModeToggle />
        <UButton
          v-if="!isAuthenticated"
          :to="localePath('/auth/login')"
          size="sm"
          color="primary"
        >
          {{ $t('auth.login') }}
        </UButton>
        <UButton
          v-else
          :to="localePath('/dashboard')"
          size="sm"
          color="primary"
          variant="soft"
        >
          {{ $t('nav.dashboard') }}
        </UButton>
        <UButton
          class="md:hidden"
          variant="ghost"
          size="sm"
          :icon="mobileMenuOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'"
          :aria-label="mobileMenuOpen ? $t('common.closeMenu') : $t('common.openMenu')"
          @click="mobileMenuOpen = !mobileMenuOpen"
        />
      </div>
    </nav>

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="mobileMenuOpen"
        class="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950"
      >
        <div class="px-4 py-4 space-y-2">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="localePath(item.to)"
            class="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            @click="mobileMenuOpen = false"
          >
            {{ item.label }}
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const localePath = useLocalePath()
const { isAuthenticated } = useAuth()
const { t } = useI18n()
const mobileMenuOpen = ref(false)

const navItems = computed(() => [
  { to: '/', label: t('nav.home') },
  { to: '/about', label: t('nav.about') },
  { to: '/contact', label: t('nav.contact') },
])
</script>
