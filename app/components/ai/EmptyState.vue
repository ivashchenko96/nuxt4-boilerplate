<template>
  <div class="flex flex-col items-center justify-center h-full py-12 px-6 text-center">
    <!-- Icon -->
    <div class="w-14 h-14 rounded-2xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center mb-4">
      <UIcon
        name="i-heroicons-sparkles"
        class="w-7 h-7 text-brand-600 dark:text-brand-400"
      />
    </div>

    <h3 class="text-base font-semibold text-gray-900 dark:text-white mb-1">
      {{ $t('ai.emptyTitle') }}
    </h3>
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-xs">
      {{ $t('ai.emptySubtitle') }}
    </p>

    <!-- Suggested prompts grid -->
    <div class="w-full max-w-sm space-y-2">
      <p class="text-xs font-medium text-gray-400 dark:text-gray-600 uppercase tracking-wider mb-3">
        {{ $t('ai.suggestions') }}
      </p>
      <button
        v-for="prompt in suggestedPrompts.slice(0, 4)"
        :key="prompt.id"
        type="button"
        class="w-full text-left px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
        @click="$emit('select', prompt.id)"
      >
        <div class="flex items-start gap-2.5">
          <UIcon
            :name="prompt.icon ?? 'i-heroicons-chat-bubble-left'"
            class="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5"
          />
          <div class="min-w-0">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
              {{ prompt.label }}
            </p>
            <p
              v-if="prompt.description"
              class="text-xs text-gray-400 dark:text-gray-600 mt-0.5 truncate"
            >
              {{ prompt.description }}
            </p>
          </div>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  select: [promptId: string]
}>()

const { suggestedPrompts } = usePrompts()
</script>
