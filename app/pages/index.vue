<template>
  <div class="bg-paper text-ink">
    <section class="min-h-[78vh] flex items-center justify-center py-20">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <UBadge
          color="primary"
          variant="soft"
          class="mb-6"
        >
          {{ $t('home.badge') }}
        </UBadge>
        <h1 class="text-4xl sm:text-5xl lg:text-6xl mb-6 leading-tight font-editorial text-ink">
          {{ $t('home.hero.title') }}
          <span class="text-brand-600">{{ $t('home.hero.highlight') }}</span>
        </h1>
        <p class="text-lg sm:text-xl text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
          {{ $t('home.hero.description') }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UButton
            :to="localePath('/dashboard')"
            size="lg"
            color="primary"
            variant="solid"
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

    <section class="py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-editorial text-ink mb-4">
            {{ $t('home.features.title') }}
          </h2>
          <p class="text-muted max-w-2xl mx-auto text-base leading-relaxed">
            {{ $t('home.features.description') }}
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="ui-panel p-7 transition-colors group hover:border-brand-300"
          >
            <div class="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center mb-4 group-hover:bg-brand-200 transition-colors">
              <UIcon
                :name="feature.icon"
                class="w-6 h-6 text-brand-700"
              />
            </div>
            <h3 class="text-lg font-semibold text-ink mb-2">
              {{ feature.title }}
            </h3>
            <p class="text-muted text-sm leading-relaxed">
              {{ feature.description }}
            </p>
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
