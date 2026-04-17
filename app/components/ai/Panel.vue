<template>
  <!-- Teleport to body so the panel overlays everything correctly -->
  <Teleport to="body">
    <!-- Backdrop (mobile only) -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="aiStore.panelOpen"
        class="lg:hidden fixed inset-0 bg-black/50 z-40"
        aria-hidden="true"
        @click="aiStore.panelOpen = false"
      />
    </Transition>

    <!-- Panel -->
    <Transition
      enter-active-class="transition-transform duration-250 ease-out"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-200 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <aside
        v-if="aiStore.panelOpen"
        class="fixed right-0 top-0 h-full w-full sm:w-[440px] bg-white dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800 z-50 flex flex-col shadow-2xl"
        aria-label="AI Assistant panel"
      >
        <!-- Header -->
        <div class="h-14 flex items-center px-4 border-b border-gray-200 dark:border-gray-800 gap-3 flex-shrink-0">
          <div class="w-7 h-7 rounded-lg bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
            <UIcon
              name="i-heroicons-sparkles"
              class="w-4 h-4 text-brand-600 dark:text-brand-400"
            />
          </div>

          <span class="font-semibold text-gray-900 dark:text-white text-sm flex-1 min-w-0 truncate">
            {{ activeTitle }}
          </span>

          <div class="flex items-center gap-1">
            <!-- New conversation -->
            <UButton
              variant="ghost"
              size="xs"
              icon="i-heroicons-plus"
              :aria-label="$t('ai.newConversation')"
              @click="newConversation"
            />
            <!-- Conversation history -->
            <UButton
              variant="ghost"
              size="xs"
              icon="i-heroicons-clock"
              :aria-label="$t('ai.conversationHistory')"
              @click="historyOpen = !historyOpen"
            />
            <!-- Open full page -->
            <UButton
              variant="ghost"
              size="xs"
              icon="i-heroicons-arrow-top-right-on-square"
              :aria-label="$t('ai.openFullPage')"
              :to="localePath('/dashboard/ai')"
              @click="aiStore.panelOpen = false"
            />
            <!-- Close -->
            <UButton
              variant="ghost"
              size="xs"
              icon="i-heroicons-x-mark"
              :aria-label="$t('ai.closePanel')"
              @click="aiStore.panelOpen = false"
            />
          </div>
        </div>

        <!-- Conversation history drawer -->
        <Transition
          enter-active-class="transition-all duration-200"
          enter-from-class="opacity-0 max-h-0"
          enter-to-class="opacity-100 max-h-80"
          leave-active-class="transition-all duration-150"
          leave-from-class="opacity-100 max-h-80"
          leave-to-class="opacity-0 max-h-0"
        >
          <div
            v-if="historyOpen && aiStore.conversations.length"
            class="border-b border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            <div class="max-h-64 overflow-y-auto py-1">
              <button
                v-for="conv in aiStore.conversations"
                :key="conv.id"
                type="button"
                :class="[
                  'w-full flex items-center gap-2 px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
                  conv.id === aiStore.activeConversationId
                    ? 'bg-brand-50 dark:bg-brand-900/10'
                    : '',
                ]"
                @click="selectConversation(conv.id)"
              >
                <UIcon
                  name="i-heroicons-chat-bubble-left"
                  class="w-4 h-4 text-gray-400 flex-shrink-0"
                />
                <span class="flex-1 text-sm text-gray-700 dark:text-gray-300 truncate">
                  {{ conv.title }}
                </span>
                <button
                  type="button"
                  class="text-gray-300 dark:text-gray-700 hover:text-red-400 dark:hover:text-red-500 flex-shrink-0"
                  :aria-label="`Delete ${conv.title}`"
                  @click.stop="aiStore.deleteConversation(conv.id)"
                >
                  <UIcon
                    name="i-heroicons-trash"
                    class="w-3.5 h-3.5"
                  />
                </button>
              </button>
            </div>
          </div>
        </Transition>

        <!-- Provider not configured warning -->
        <div
          v-if="!isConfigured"
          class="mx-4 mt-3 px-3 py-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-start gap-2 flex-shrink-0"
        >
          <UIcon
            name="i-heroicons-exclamation-triangle"
            class="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5"
          />
          <p class="text-xs text-amber-700 dark:text-amber-400">
            {{ $t('ai.notConfiguredWarning') }}
            <NuxtLink
              :to="localePath('/dashboard/settings')"
              class="underline ml-1"
              @click="aiStore.panelOpen = false"
            >
              {{ $t('ai.configureNow') }}
            </NuxtLink>
          </p>
        </div>

        <!-- Message list -->
        <AiMessageList
          :messages="aiStore.activeMessages"
          class="flex-1 overflow-hidden"
          @retry="handleRetry"
          @select-prompt="handlePromptSelect"
        />

        <!-- Input area -->
        <AiInput
          ref="inputRef"
          :is-streaming="aiStore.isStreaming"
          :prefill="inputPrefill"
          @send="handleSend"
          @stop="aiChat.abort()"
          @open-prompt-picker="aiStore.promptPickerOpen = true"
        />
      </aside>
    </Transition>

    <!-- Prompt Picker modal -->
    <AiPromptPicker @select="onPromptSelected" />

    <!-- Command Palette modal -->
    <AiCommandPalette />
  </Teleport>
</template>

<script setup lang="ts">
import type { AiFile } from '~~/shared/types/ai'

const aiStore = useAiStore()
const aiChat = useAiChat()
const localePath = useLocalePath()
const { t } = useI18n()

const historyOpen = ref(false)
const inputPrefill = ref('')
const inputRef = ref<{ focus: () => void } | null>(null)

const isConfigured = computed(() => !!aiStore.settings.provider.baseUrl)

const activeTitle = computed(
  () => aiStore.activeConversation?.title ?? t('ai.assistant'),
)

// Ensure a conversation exists when the panel opens
watch(() => aiStore.panelOpen, (open) => {
  if (open && !aiStore.activeConversationId) {
    aiStore.createConversation()
  }
  if (open) nextTick(() => inputRef.value?.focus())
})

function newConversation() {
  aiStore.createConversation()
  historyOpen.value = false
  nextTick(() => inputRef.value?.focus())
}

function selectConversation(id: string) {
  aiStore.setActiveConversation(id)
  historyOpen.value = false
}

async function handleSend(content: string, files: AiFile[]) {
  inputPrefill.value = ''
  await aiChat.sendMessage(content, files)
}

async function handleRetry() {
  await aiChat.retry()
}

function handlePromptSelect(promptId: string) {
  const { getPromptById, buildPrompt } = usePrompts()
  const prompt = getPromptById(promptId)
  if (!prompt) return
  const hasRequired = prompt.variables?.some(v => v.required)
  if (hasRequired) {
    // Open picker so user can fill variables
    aiStore.promptPickerOpen = true
  }
  else {
    inputPrefill.value = buildPrompt(prompt)
  }
}

function onPromptSelected(_promptId: string, prefillText: string) {
  inputPrefill.value = prefillText
  nextTick(() => inputRef.value?.focus())
}

// Global keyboard shortcut: Ctrl/Cmd + K → command palette
if (import.meta.client) {
  const handler = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault()
      aiStore.commandPaletteOpen = !aiStore.commandPaletteOpen
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
      e.preventDefault()
      aiStore.panelOpen = !aiStore.panelOpen
    }
  }
  onMounted(() => document.addEventListener('keydown', handler))
  onUnmounted(() => document.removeEventListener('keydown', handler))
}
</script>
