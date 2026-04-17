<template>
  <div>
    <!-- Hero -->
    <section class="py-24 bg-paper">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-editorial text-ink mb-4">
          {{ $t('about.title') }}
        </h1>
        <p class="text-lg text-muted max-w-2xl mx-auto leading-relaxed">
          {{ $t('about.description') }}
        </p>
      </div>
    </section>

    <!-- Content -->
    <section class="py-16 bg-paper">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-none">
          <h2 class="text-2xl md:text-3xl font-editorial text-ink mb-4">
            {{ $t('about.missionTitle') }}
          </h2>
          <p class="text-muted mb-8 leading-relaxed">
            {{ $t('about.missionText') }}
          </p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div
              v-for="value in values"
              :key="value.title"
              class="ui-panel p-6"
            >
              <UIcon
                :name="value.icon"
                class="w-8 h-8 text-brand-600 mb-3"
              />
              <h3 class="font-semibold text-ink mb-2">
                {{ value.title }}
              </h3>
              <p class="text-sm text-muted leading-relaxed">
                {{ value.description }}
              </p>
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
