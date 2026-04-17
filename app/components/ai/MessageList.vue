<template>
  <div
    ref="listEl"
    class="flex-1 overflow-y-auto scroll-smooth"
  >
    <!-- Empty state -->
    <AiEmptyState
      v-if="!messages.length"
      @select="$emit('selectPrompt', $event)"
    />

    <!-- Messages -->
    <template v-else>
      <AiMessage
        v-for="msg in messages"
        :key="msg.id"
        :message="msg"
        @retry="$emit('retry')"
      />
      <!-- Scroll anchor -->
      <div ref="bottomEl" />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { AiMessage } from '~~/shared/types/ai'

const props = defineProps<{
  messages: AiMessage[]
}>()

defineEmits<{
  retry: []
  selectPrompt: [id: string]
}>()

const listEl = ref<HTMLElement | null>(null)
const bottomEl = ref<HTMLElement | null>(null)

// Auto-scroll to bottom when messages change or streaming
watch(
  () => props.messages,
  () => nextTick(scrollToBottom),
  { deep: true },
)

watch(
  () => props.messages[props.messages.length - 1]?.content,
  () => nextTick(scrollToBottom),
)

function scrollToBottom() {
  bottomEl.value?.scrollIntoView({ behavior: 'smooth', block: 'end' })
}
</script>
