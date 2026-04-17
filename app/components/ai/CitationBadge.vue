<template>
  <span
    class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800/40 transition-colors"
    :title="citation.url ? `Source: ${citation.url}` : undefined"
    @click="citation.url && openUrl(citation.url)"
  >
    <UIcon
      name="i-heroicons-book-open-micro"
      class="w-3 h-3 flex-shrink-0"
    />
    <span class="max-w-[160px] truncate">{{ citation.title }}</span>
    <UIcon
      v-if="citation.url"
      name="i-heroicons-arrow-top-right-on-square-micro"
      class="w-3 h-3 flex-shrink-0 opacity-60"
    />
  </span>
</template>

<script setup lang="ts">
import type { AiCitation } from '~~/shared/types/ai'

defineProps<{
  citation: AiCitation
}>()

function openUrl(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer')
}
</script>
