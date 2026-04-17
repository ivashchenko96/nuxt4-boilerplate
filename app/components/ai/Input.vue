<template>
  <div class="border-t border-gray-200 dark:border-gray-700 p-3 space-y-2">
    <!-- Attached files preview -->
    <div
      v-if="attachedFiles.length"
      class="flex flex-wrap gap-1.5 px-1"
    >
      <AiFileChip
        v-for="file in attachedFiles"
        :key="file.id"
        :file="file"
        :removable="true"
        @remove="removeFile(file.id)"
      />
    </div>

    <!-- Input row -->
    <div class="flex items-end gap-2">
      <!-- Prompt picker trigger -->
      <UButton
        variant="ghost"
        size="sm"
        icon="i-heroicons-bolt"
        :aria-label="$t('ai.promptPicker')"
        class="flex-shrink-0 text-gray-400 hover:text-brand-500"
        @click="$emit('openPromptPicker')"
      />

      <!-- File attach -->
      <UButton
        variant="ghost"
        size="sm"
        icon="i-heroicons-paper-clip"
        :aria-label="$t('ai.attachFile')"
        class="flex-shrink-0 text-gray-400 hover:text-brand-500"
        @click="triggerFileInput"
      />

      <!-- Hidden file input -->
      <input
        ref="fileInputEl"
        type="file"
        multiple
        accept="image/*,.pdf,.csv,.txt,.md,.json"
        class="hidden"
        @change="onFilesSelected"
      >

      <!-- Text area -->
      <div class="flex-1 relative">
        <textarea
          ref="textareaEl"
          v-model="inputText"
          :placeholder="$t('ai.inputPlaceholder')"
          :disabled="disabled"
          rows="1"
          class="w-full resize-none rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 px-3.5 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          style="min-height: 42px; max-height: 160px;"
          @keydown.enter.exact.prevent="submit"
          @keydown.enter.shift.exact="newline"
          @input="autoResize"
        />
      </div>

      <!-- Send / Stop button -->
      <UButton
        v-if="isStreaming"
        color="error"
        variant="soft"
        size="sm"
        icon="i-heroicons-stop"
        :aria-label="$t('ai.stop')"
        class="flex-shrink-0"
        @click="$emit('stop')"
      />
      <UButton
        v-else
        color="primary"
        size="sm"
        icon="i-heroicons-paper-airplane"
        :aria-label="$t('ai.send')"
        :disabled="!inputText.trim() && !attachedFiles.length"
        class="flex-shrink-0"
        @click="submit"
      />
    </div>

    <p class="text-[10px] text-gray-400 dark:text-gray-600 text-center px-1">
      {{ $t('ai.inputHint') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { AiFile } from '~~/shared/types/ai'

const props = defineProps<{
  disabled?: boolean
  isStreaming?: boolean
  prefill?: string
}>()

const emit = defineEmits<{
  send: [content: string, files: AiFile[]]
  stop: []
  openPromptPicker: []
}>()

const inputText = ref('')
const attachedFiles = ref<AiFile[]>([])
const textareaEl = ref<HTMLTextAreaElement | null>(null)
const fileInputEl = ref<HTMLInputElement | null>(null)

// Watch for prefill from parent (e.g., prompt picker selection)
watch(() => props.prefill, (val) => {
  if (val) {
    inputText.value = val
    nextTick(() => {
      autoResize()
      textareaEl.value?.focus()
    })
  }
}, { immediate: true })

function submit() {
  const text = inputText.value.trim()
  if (!text && !attachedFiles.value.length) return
  emit('send', text, [...attachedFiles.value])
  inputText.value = ''
  attachedFiles.value = []
  nextTick(() => {
    if (textareaEl.value) textareaEl.value.style.height = '42px'
  })
}

function newline() {
  // Allow shift+enter for newlines — handled by default browser behavior
}

function autoResize() {
  const el = textareaEl.value
  if (!el) return
  el.style.height = '42px'
  el.style.height = `${Math.min(el.scrollHeight, 160)}px`
}

function triggerFileInput() {
  fileInputEl.value?.click()
}

async function onFilesSelected(event: Event) {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files ?? [])
  for (const file of files) {
    const aiFile: AiFile = {
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      type: file.type,
    }
    // Generate preview URL for images
    if (file.type.startsWith('image/')) {
      aiFile.previewUrl = URL.createObjectURL(file)
    }
    attachedFiles.value.push(aiFile)
  }
  // Reset the input so the same file can be re-selected
  input.value = ''
}

function removeFile(id: string) {
  const idx = attachedFiles.value.findIndex(f => f.id === id)
  if (idx > -1) {
    const file = attachedFiles.value[idx]
    if (file?.previewUrl) URL.revokeObjectURL(file.previewUrl)
    attachedFiles.value.splice(idx, 1)
  }
}

// Clean up object URLs on unmount
onUnmounted(() => {
  for (const f of attachedFiles.value) {
    if (f.previewUrl) URL.revokeObjectURL(f.previewUrl)
  }
})

/** Focus the textarea from parent */
function focus() {
  textareaEl.value?.focus()
}

defineExpose({ focus })
</script>
