import { defineStore } from 'pinia'
import type { AiConversation, AiMessage, AiSettings } from '~~/shared/types/ai'

const CONVERSATIONS_KEY = 'ai_conversations'
const SETTINGS_KEY = 'ai_settings'

const defaultSettings: AiSettings = {
  provider: {
    kind: 'openai',
    baseUrl: '',
    modelId: 'gpt-4o',
    maxTokens: 2048,
    temperature: 0.7,
    topP: 1,
  },
  enabled: true,
  streamingEnabled: true,
  showCitations: true,
  maxConversations: 50,
}

export const useAiStore = defineStore('ai', () => {
  // ── Panel / Command palette state ────────────────────────────────────────
  const panelOpen = ref(false)
  const commandPaletteOpen = ref(false)
  const promptPickerOpen = ref(false)

  // ── Conversations ─────────────────────────────────────────────────────────
  const conversations = ref<AiConversation[]>([])
  const activeConversationId = ref<string | null>(null)

  const activeConversation = computed(
    () => conversations.value.find(c => c.id === activeConversationId.value) ?? null,
  )

  const activeMessages = computed(
    () => activeConversation.value?.messages ?? [],
  )

  // ── Streaming / loading ───────────────────────────────────────────────────
  const isStreaming = ref(false)
  const streamAbortController = ref<AbortController | null>(null)

  // ── Settings ──────────────────────────────────────────────────────────────
  const settings = ref<AiSettings>({ ...defaultSettings })

  // ── Conversation management ───────────────────────────────────────────────

  function createConversation(title = 'New conversation'): AiConversation {
    const now = Date.now()
    const conversation: AiConversation = {
      id: crypto.randomUUID(),
      title,
      messages: [],
      createdAt: now,
      updatedAt: now,
    }
    conversations.value.unshift(conversation)
    activeConversationId.value = conversation.id
    trimConversations()
    return conversation
  }

  function setActiveConversation(id: string) {
    activeConversationId.value = id
  }

  function deleteConversation(id: string) {
    const idx = conversations.value.findIndex(c => c.id === id)
    if (idx > -1) conversations.value.splice(idx, 1)
    if (activeConversationId.value === id) {
      activeConversationId.value = conversations.value[0]?.id ?? null
    }
    persistConversations()
  }

  function clearAllConversations() {
    conversations.value = []
    activeConversationId.value = null
    persistConversations()
  }

  function renameConversation(id: string, title: string) {
    const conv = conversations.value.find(c => c.id === id)
    if (conv) {
      conv.title = title
      conv.updatedAt = Date.now()
    }
  }

  // ── Message management ────────────────────────────────────────────────────

  function addMessage(conversationId: string, message: Omit<AiMessage, 'id' | 'createdAt'>): AiMessage {
    const conv = conversations.value.find(c => c.id === conversationId)
    if (!conv) throw new Error(`Conversation ${conversationId} not found`)

    const full: AiMessage = {
      ...message,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    }
    conv.messages.push(full)
    conv.updatedAt = Date.now()

    // Auto-title from first user message
    if (conv.messages.filter(m => m.role === 'user').length === 1 && message.role === 'user') {
      conv.title = message.content.slice(0, 60) + (message.content.length > 60 ? '…' : '')
    }
    return full
  }

  function updateMessage(conversationId: string, messageId: string, patch: Partial<AiMessage>) {
    const conv = conversations.value.find(c => c.id === conversationId)
    if (!conv) return
    const msg = conv.messages.find(m => m.id === messageId)
    if (!msg) return
    Object.assign(msg, patch)
    conv.updatedAt = Date.now()
  }

  function removeLastMessage(conversationId: string) {
    const conv = conversations.value.find(c => c.id === conversationId)
    if (conv && conv.messages.length > 0) {
      conv.messages.pop()
    }
  }

  // ── Streaming helpers ─────────────────────────────────────────────────────

  function startStreaming(): AbortController {
    const controller = new AbortController()
    streamAbortController.value = controller
    isStreaming.value = true
    return controller
  }

  function stopStreaming() {
    streamAbortController.value?.abort()
    streamAbortController.value = null
    isStreaming.value = false
  }

  // ── Settings ──────────────────────────────────────────────────────────────

  function updateSettings(patch: Partial<AiSettings>) {
    settings.value = { ...settings.value, ...patch }
    persistSettings()
  }

  function updateProviderConfig(patch: Partial<AiSettings['provider']>) {
    settings.value.provider = { ...settings.value.provider, ...patch }
    persistSettings()
  }

  // ── Persistence ───────────────────────────────────────────────────────────

  function persistConversations() {
    if (!import.meta.client) return
    try {
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations.value))
    }
    catch {
      // Storage quota exceeded — silently ignore
    }
  }

  function persistSettings() {
    if (!import.meta.client) return
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings.value))
    }
    catch {
      // Storage quota exceeded — silently ignore
    }
  }

  function loadFromStorage() {
    if (!import.meta.client) return
    try {
      const convRaw = localStorage.getItem(CONVERSATIONS_KEY)
      if (convRaw) conversations.value = JSON.parse(convRaw) as AiConversation[]

      const settingsRaw = localStorage.getItem(SETTINGS_KEY)
      if (settingsRaw) {
        // Deep-merge so new default keys survive upgrades
        const stored = JSON.parse(settingsRaw) as Partial<AiSettings>
        settings.value = {
          ...defaultSettings,
          ...stored,
          provider: { ...defaultSettings.provider, ...stored.provider },
        }
      }

      // Restore last active conversation
      if (conversations.value.length > 0) {
        activeConversationId.value = conversations.value[0]?.id ?? null
      }
    }
    catch {
      // Corrupted storage — reset
      conversations.value = []
      settings.value = { ...defaultSettings }
    }
  }

  function trimConversations() {
    if (conversations.value.length > settings.value.maxConversations) {
      conversations.value = conversations.value.slice(0, settings.value.maxConversations)
    }
  }

  // ── Watch for persistence ─────────────────────────────────────────────────
  if (import.meta.client) {
    watch(conversations, persistConversations, { deep: true })
  }

  return {
    // Panel
    panelOpen,
    commandPaletteOpen,
    promptPickerOpen,
    // Conversations
    conversations,
    activeConversationId,
    activeConversation,
    activeMessages,
    // Streaming
    isStreaming,
    streamAbortController,
    // Settings
    settings,
    // Actions
    createConversation,
    setActiveConversation,
    deleteConversation,
    clearAllConversations,
    renameConversation,
    addMessage,
    updateMessage,
    removeLastMessage,
    startStreaming,
    stopStreaming,
    updateSettings,
    updateProviderConfig,
    loadFromStorage,
  }
})
