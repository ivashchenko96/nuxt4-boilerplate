<template>
  <div>
    <section class="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-brand-950 via-gray-900 to-gray-950">
      <div class="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      <div class="relative max-w-4xl mx-auto px-4 text-center">
        <UBadge color="primary" variant="soft" class="mb-6">
          {{ $t('home.badge') }}
        </UBadge>
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
          {{ $t('home.hero.title') }}
          <span class="text-brand-400">{{ $t('home.hero.highlight') }}</span>
        </h1>
        <p class="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          {{ $t('home.hero.description') }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton
            :to="localePath('/dashboard')"
            size="lg"
            color="primary"
            icon="i-heroicons-rocket-launch"
          >
            {{ $t('home.hero.cta') }}
          </UButton>
          <UButton
            href="https://github.com"
            size="lg"
            variant="outline"
            color="neutral"
            icon="i-simple-icons-github"
            target="_blank"
          >
            {{ $t('home.hero.github') }}
          </UButton>
        </div>
      </div>
    </section>

    <section class="py-24 bg-white dark:bg-gray-950">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">{{ $t('home.features.title') }}</h2>
          <p class="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">{{ $t('home.features.description') }}</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="p-6 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-brand-200 dark:hover:border-brand-800 transition-colors group"
          >
            <div class="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center mb-4 group-hover:bg-brand-200 dark:group-hover:bg-brand-800/50 transition-colors">
              <UIcon :name="feature.icon" class="w-6 h-6 text-brand-600 dark:text-brand-400" />
            </div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">{{ feature.title }}</h3>
            <p class="text-gray-500 dark:text-gray-400 text-sm">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const localePath = useLocalePath()
const { t } = useI18n()

useSeo({
  title: t('home.meta.title'),
  description: t('home.meta.description'),
})

const features = computed(() => [
  {
    icon: 'i-heroicons-shield-check',
    title: t('home.features.security.title'),
    description: t('home.features.security.description'),
  },
  {
    icon: 'i-heroicons-globe-alt',
    title: t('home.features.i18n.title'),
    description: t('home.features.i18n.description'),
  },
  {
    icon: 'i-heroicons-building-office-2',
    title: t('home.features.multiTenant.title'),
    description: t('home.features.multiTenant.description'),
  },
  {
    icon: 'i-heroicons-chart-bar',
    title: t('home.features.dashboard.title'),
    description: t('home.features.dashboard.description'),
  },
  {
    icon: 'i-heroicons-device-phone-mobile',
    title: t('home.features.pwa.title'),
    description: t('home.features.pwa.description'),
  },
  {
    icon: 'i-heroicons-puzzle-piece',
    title: t('home.features.modular.title'),
    description: t('home.features.modular.description'),
  },
])
</script>
