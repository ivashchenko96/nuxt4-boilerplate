<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ $t('nav.reports') }}</h1>
      <p class="text-gray-500 text-sm mt-1">{{ $t('dashboard.subtitle') }}</p>
    </div>
    <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
      <div class="flex items-center justify-center h-64 text-gray-400">
        <div class="text-center">
          <UIcon name="i-heroicons-chart-bar" class="w-16 h-16 mx-auto mb-4" />
          <p class="text-lg font-medium">{{ $t('dashboard.chartPlaceholder') }}</p>
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
