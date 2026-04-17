<template>
  <div
    :class="[
      'flex gap-3 px-4 py-3',
      isUser ? 'flex-row-reverse' : 'flex-row',
    ]"
  >
    <!-- Avatar -->
    <div
      :class="[
        'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
        isUser
          ? 'bg-brand-600'
          : 'bg-gray-200 dark:bg-gray-700',
      ]"
    >
      <UIcon
        :name="isUser ? 'i-heroicons-user' : 'i-heroicons-sparkles'"
        :class="[
          'w-3.5 h-3.5',
          isUser ? 'text-white' : 'text-gray-600 dark:text-gray-300',
        ]"
      />
    </div>

    <!-- Message bubble -->
    <div
      :class="[
        'flex flex-col max-w-[85%] min-w-0',
        isUser ? 'items-end' : 'items-start',
      ]"
    >
      <!-- Tool result -->
      <AiToolResult
        v-if="message.toolResult"
        :result="message.toolResult"
        class="mb-2 w-full"
      />

      <!-- Content bubble -->
      <div
        v-if="message.content || message.isStreaming"
        :class="[
          'rounded-2xl px-3.5 py-2.5 text-sm max-w-full',
          isUser
            ? 'bg-brand-600 text-white rounded-br-sm'
            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-bl-sm',
          message.error ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10' : '',
        ]"
      >
        <!-- Error state -->
        <div
          v-if="message.error"
          class="flex items-start gap-2 text-red-600 dark:text-red-400"
        >
          <UIcon
            name="i-heroicons-exclamation-circle"
            class="w-4 h-4 flex-shrink-0 mt-0.5"
          />
          <p>{{ message.error }}</p>
        </div>

        <!-- User plain text -->
        <p
          v-else-if="isUser"
          class="whitespace-pre-wrap leading-relaxed"
        >
          {{ message.content }}
        </p>

        <!-- Assistant markdown content -->
        <AiMarkdownContent
          v-else-if="message.content"
          :content="message.content"
        />

        <!-- Streaming indicator -->
        <span
          v-if="message.isStreaming && !message.content"
          class="flex items-center gap-1.5 text-gray-400 dark:text-gray-500"
        >
          <span
            v-for="n in 3"
            :key="n"
            class="w-1.5 h-1.5 rounded-full bg-current animate-bounce"
            :style="{ animationDelay: `${(n - 1) * 0.15}s` }"
          />
        </span>

        <!-- Streaming cursor on partial content -->
        <AiStreamCursor
          v-else-if="message.isStreaming"
        />
      </div>

      <!-- Attached files -->
      <div
        v-if="message.files?.length"
        class="flex flex-wrap gap-1 mt-1.5"
      >
        <AiFileChip
          v-for="file in message.files"
          :key="file.id"
          :file="file"
        />
      </div>

      <!-- Citations -->
      <div
        v-if="message.citations?.length"
        class="flex flex-wrap gap-1.5 mt-2"
      >
        <AiCitationBadge
          v-for="citation in message.citations"
          :key="citation.id"
          :citation="citation"
        />
      </div>

      <!-- Timestamp + retry -->
      <div class="flex items-center gap-2 mt-1">
        <span class="text-[10px] text-gray-400 dark:text-gray-600">
          {{ formatTime(message.createdAt) }}
        </span>
        <button
          v-if="message.error && !isUser"
          type="button"
          class="text-[10px] text-brand-500 hover:text-brand-600 flex items-center gap-0.5"
          @click="$emit('retry')"
        >
          <UIcon
            name="i-heroicons-arrow-path"
            class="w-3 h-3"
          />
          Retry
        </button>
        <span
          v-if="message.model && !isUser"
          class="text-[10px] text-gray-300 dark:text-gray-700"
        >
          {{ message.model }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AiMessage } from '~~/shared/types/ai'

const props = defineProps<{
  message: AiMessage
}>()

defineEmits<{
  retry: []
}>()

const isUser = computed(() => props.message.role === 'user')

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>
