<template>
  <div class="flex h-[calc(100vh-4rem)] -m-6 overflow-hidden">
    <!-- Conversation sidebar -->
    <div
      :class="[
        'flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900',
        sidebarOpen ? 'flex w-64' : 'hidden',
        'md:flex md:w-56 lg:w-64',
      ]"
    >
      <!-- Sidebar header -->
      <div class="h-14 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
        <div class="flex items-center gap-2">
          <UIcon
            name="i-heroicons-sparkles"
            class="w-4 h-4 text-brand-500"
          />
          <span class="font-semibold text-sm text-gray-900 dark:text-white">{{ $t('nav.ai') }}</span>
        </div>
        <UButton
          variant="ghost"
          size="xs"
          icon="i-heroicons-plus"
          :aria-label="$t('ai.newConversation')"
          @click="newConversation"
        />
      </div>

      <!-- Conversation list -->
      <div class="flex-1 overflow-y-auto py-2">
        <div
          v-if="!aiStore.conversations.length"
          class="px-4 py-6 text-center"
        >
          <p class="text-xs text-gray-400 dark:text-gray-600">
            {{ $t('ai.noConversations') }}
          </p>
        </div>
        <button
          v-for="conv in aiStore.conversations"
          :key="conv.id"
          type="button"
          :class="[
            'w-full flex items-center gap-2.5 px-3 py-2 text-left group transition-colors rounded-lg mx-1 w-[calc(100%-8px)]',
            conv.id === aiStore.activeConversationId
              ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800',
          ]"
          @click="aiStore.setActiveConversation(conv.id)"
        >
          <UIcon
            name="i-heroicons-chat-bubble-left"
            class="w-4 h-4 flex-shrink-0"
          />
          <span class="flex-1 text-xs truncate">{{ conv.title }}</span>
          <button
            type="button"
            class="opacity-0 group-hover:opacity-100 flex-shrink-0 text-gray-300 hover:text-red-400 dark:text-gray-700 dark:hover:text-red-500"
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

      <!-- Sidebar footer -->
      <div class="border-t border-gray-200 dark:border-gray-800 p-3 space-y-1">
        <button
          type="button"
          class="w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          @click="aiStore.clearAllConversations()"
        >
          <UIcon
            name="i-heroicons-trash"
            class="w-3.5 h-3.5"
          />
          {{ $t('ai.clearAll') }}
        </button>
        <NuxtLink
          :to="localePath('/dashboard/settings#ai')"
          class="flex items-center gap-2 px-2 py-1.5 rounded text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <UIcon
            name="i-heroicons-cog-6-tooth"
            class="w-3.5 h-3.5"
          />
          {{ $t('ai.settings') }}
        </NuxtLink>
      </div>
    </div>

    <!-- Main chat area -->
    <div class="flex-1 flex flex-col min-w-0 bg-gray-50 dark:bg-gray-950">
      <!-- Chat header -->
      <div class="h-14 flex items-center gap-3 px-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex-shrink-0">
        <!-- Mobile sidebar toggle -->
        <UButton
          variant="ghost"
          size="sm"
          icon="i-heroicons-bars-3"
          class="md:hidden"
          @click="sidebarOpen = !sidebarOpen"
        />

        <div class="flex-1 min-w-0">
          <h1 class="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {{ activeTitle }}
          </h1>
          <p
            v-if="aiStore.settings.provider.modelId"
            class="text-xs text-gray-400 dark:text-gray-600"
          >
            {{ aiStore.settings.provider.modelId }}
          </p>
        </div>

        <div class="flex items-center gap-1">
          <!-- Prompt picker -->
          <UButton
            variant="ghost"
            size="xs"
            icon="i-heroicons-bolt"
            :aria-label="$t('ai.promptPicker')"
            @click="aiStore.promptPickerOpen = true"
          />
          <!-- New conversation -->
          <UButton
            variant="ghost"
            size="xs"
            icon="i-heroicons-plus"
            :aria-label="$t('ai.newConversation')"
            @click="newConversation"
          />
        </div>
      </div>

      <!-- Provider not configured warning -->
      <div
        v-if="!isConfigured"
        class="mx-4 mt-3 px-3 py-2.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-start gap-2 flex-shrink-0"
      >
        <UIcon
          name="i-heroicons-exclamation-triangle"
          class="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5"
        />
        <p class="text-sm text-amber-700 dark:text-amber-400">
          {{ $t('ai.notConfiguredWarning') }}
          <NuxtLink
            :to="localePath('/dashboard/settings#ai')"
            class="underline ml-1"
          >
            {{ $t('ai.configureNow') }}
          </NuxtLink>
        </p>
      </div>

      <!-- Messages -->
      <AiMessageList
        :messages="aiStore.activeMessages"
        class="flex-1 overflow-hidden"
        @retry="handleRetry"
        @select-prompt="handlePromptSelect"
      />

      <!-- Input -->
      <div class="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <AiInput
          ref="inputRef"
          class="max-w-3xl mx-auto"
          :is-streaming="aiStore.isStreaming"
          :prefill="inputPrefill"
          @send="handleSend"
          @stop="aiChat.abort()"
          @open-prompt-picker="aiStore.promptPickerOpen = true"
        />
      </div>
    </div>

    <!-- Prompt picker + command palette (shared, teleported) -->
    <AiPromptPicker @select="onPromptSelected" />
    <AiCommandPalette />
  </div>
</template>

<script setup lang="ts">
import type { AiFile } from '~~/shared/types/ai'

definePageMeta({ layout: 'dashboard', middleware: ['auth'] })

const aiStore = useAiStore()
const aiChat = useAiChat()
const localePath = useLocalePath()
const { t } = useI18n()

useSeo({ title: t('nav.ai'), noIndex: true })

const sidebarOpen = ref(false)
const inputPrefill = ref('')
const inputRef = ref<{ focus: () => void } | null>(null)

const isConfigured = computed(() => !!aiStore.settings.provider.baseUrl)

const activeTitle = computed(
  () => aiStore.activeConversation?.title ?? t('ai.assistant'),
)

// Ensure a conversation exists on mount
onMounted(() => {
  if (!aiStore.activeConversationId) {
    aiStore.createConversation()
  }
})

function newConversation() {
  aiStore.createConversation()
  nextTick(() => inputRef.value?.focus())
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
</script>
