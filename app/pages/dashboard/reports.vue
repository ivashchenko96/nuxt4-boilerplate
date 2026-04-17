<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-editorial text-ink">
        {{ $t('nav.reports') }}
      </h1>
      <p class="text-muted text-sm mt-2">
        {{ $t('dashboard.subtitle') }}
      </p>
    </div>
    <div class="ui-panel p-6">
      <div class="flex items-center justify-center h-64 text-muted">
        <div class="text-center">
          <UIcon
            name="i-heroicons-chart-bar"
            class="w-16 h-16 mx-auto mb-4"
          />
          <p class="text-lg font-editorial">
            {{ $t('dashboard.chartPlaceholder') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: ['auth'] })
const { t } = useI18n()
useSeo({ title: t('nav.reports'), noIndex: true })
</script>
