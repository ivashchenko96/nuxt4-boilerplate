<template>
  <!-- Tool result card -->
  <div class="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden text-sm">
    <div class="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700">
      <UIcon
        :name="result.error ? 'i-heroicons-exclamation-triangle' : 'i-heroicons-wrench'"
        :class="result.error ? 'text-red-500' : 'text-emerald-500'"
        class="w-4 h-4 flex-shrink-0"
      />
      <span class="font-medium text-gray-700 dark:text-gray-300 truncate">{{ result.name }}</span>
      <UBadge
        v-if="result.error"
        color="error"
        variant="subtle"
        size="xs"
        class="ml-auto flex-shrink-0"
      >
        Error
      </UBadge>
      <UBadge
        v-else
        color="success"
        variant="subtle"
        size="xs"
        class="ml-auto flex-shrink-0"
      >
        Success
      </UBadge>
    </div>

    <!-- Error message -->
    <div
      v-if="result.error"
      class="px-3 py-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10"
    >
      {{ result.error }}
    </div>

    <!-- Markdown result -->
    <div
      v-else-if="result.isMarkdown && typeof result.result === 'string'"
      class="px-3 py-2"
    >
      <AiMarkdownContent :content="result.result" />
    </div>

    <!-- JSON / string result -->
    <div
      v-else-if="result.result !== null && result.result !== undefined"
      class="px-3 py-2"
    >
      <template v-if="typeof result.result === 'string'">
        <p class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {{ result.result }}
        </p>
      </template>
      <template v-else>
        <button
          type="button"
          class="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-1"
          @click="expanded = !expanded"
        >
          <UIcon
            :name="expanded ? 'i-heroicons-chevron-down' : 'i-heroicons-chevron-right'"
            class="w-3 h-3"
          />
          {{ expanded ? 'Collapse' : 'Expand result' }}
        </button>
        <pre
          v-if="expanded"
          class="text-xs bg-gray-100 dark:bg-gray-900 rounded p-2 overflow-x-auto text-gray-700 dark:text-gray-300"
        >{{ JSON.stringify(result.result, null, 2) }}</pre>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AiToolResult } from '~~/shared/types/ai'

defineProps<{
  result: AiToolResult
}>()

const expanded = ref(false)
</script>
