<template>
  <span
    class="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 max-w-[180px]"
    :title="file.name"
  >
    <UIcon
      :name="fileIcon"
      class="w-3 h-3 flex-shrink-0"
    />
    <span class="truncate">{{ file.name }}</span>
    <span class="text-gray-400 dark:text-gray-600 whitespace-nowrap">{{ formatSize(file.size) }}</span>
    <button
      v-if="removable"
      type="button"
      class="ml-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0"
      :aria-label="`Remove ${file.name}`"
      @click.stop="$emit('remove')"
    >
      <UIcon
        name="i-heroicons-x-mark-micro"
        class="w-3 h-3"
      />
    </button>
  </span>
</template>

<script setup lang="ts">
import type { AiFile } from '~~/shared/types/ai'

const props = defineProps<{
  file: AiFile
  removable?: boolean
}>()

defineEmits<{ remove: [] }>()

const fileIcon = computed(() => {
  const t = props.file.type
  if (t.startsWith('image/')) return 'i-heroicons-photo'
  if (t === 'application/pdf') return 'i-heroicons-document'
  if (t.includes('spreadsheet') || t.includes('csv')) return 'i-heroicons-table-cells'
  return 'i-heroicons-paper-clip'
})

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}
</script>
