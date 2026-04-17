<template>
  <div>
    <!-- Hero -->
    <section class="bg-gradient-to-br from-brand-950 via-gray-900 to-gray-950 py-24">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h1 class="text-4xl font-extrabold text-white mb-4">
          {{ $t('about.title') }}
        </h1>
        <p class="text-lg text-gray-300 max-w-2xl mx-auto">
          {{ $t('about.description') }}
        </p>
      </div>
    </section>

    <!-- Content -->
    <section class="py-16 bg-white dark:bg-gray-950">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="prose dark:prose-invert max-w-none">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">{{ $t('about.missionTitle') }}</h2>
          <p class="text-gray-600 dark:text-gray-400 mb-8">{{ $t('about.missionText') }}</p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div
              v-for="value in values"
              :key="value.title"
              class="p-6 rounded-xl border border-gray-200 dark:border-gray-800"
            >
              <UIcon :name="value.icon" class="w-8 h-8 text-brand-600 dark:text-brand-400 mb-3" />
              <h3 class="font-semibold text-gray-900 dark:text-white mb-2">{{ value.title }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ value.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()

useSeo({
  title: t('about.meta.title'),
  description: t('about.meta.description'),
})

const values = computed(() => [
  {
    icon: 'i-heroicons-shield-check',
    title: t('about.values.security.title'),
    description: t('about.values.security.description'),
  },
  {
    icon: 'i-heroicons-heart',
    title: t('about.values.openSource.title'),
    description: t('about.values.openSource.description'),
  },
  {
    icon: 'i-heroicons-rocket-launch',
    title: t('about.values.performance.title'),
    description: t('about.values.performance.description'),
  },
])
</script>
