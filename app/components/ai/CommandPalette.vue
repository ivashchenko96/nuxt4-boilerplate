<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-150"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-100"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="aiStore.commandPaletteOpen"
        class="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4"
        @click.self="aiStore.commandPaletteOpen = false"
      >
        <div
          class="fixed inset-0 bg-black/40 backdrop-blur-sm"
          @click="aiStore.commandPaletteOpen = false"
        />

        <div class="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <!-- Search -->
          <div class="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <UIcon
              name="i-heroicons-magnifying-glass"
              class="w-4 h-4 text-gray-400 flex-shrink-0"
            />
            <input
              ref="inputEl"
              v-model="query"
              type="text"
              :placeholder="$t('ai.commandPlaceholder')"
              class="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
              @keydown.escape="aiStore.commandPaletteOpen = false"
              @keydown.down.prevent="moveDown"
              @keydown.up.prevent="moveUp"
              @keydown.enter.prevent="runHighlighted"
            >
            <kbd class="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-gray-100 dark:bg-gray-800 text-gray-500 rounded">
              ESC
            </kbd>
          </div>

          <!-- Command list -->
          <div class="overflow-y-auto max-h-[380px] py-1">
            <template v-if="filteredGroups.length">
              <template
                v-for="group in filteredGroups"
                :key="group.label"
              >
                <p class="px-3 pt-3 pb-1 text-[10px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider">
                  {{ group.label }}
                </p>
                <button
                  v-for="cmd in group.commands"
                  :key="cmd.id"
                  type="button"
                  :class="[
                    'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
                    highlightedId === cmd.id
                      ? 'bg-brand-50 dark:bg-brand-900/20'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800',
                  ]"
                  @mouseenter="highlightedId = cmd.id"
                  @click="run(cmd)"
                >
                  <div class="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                    <UIcon
                      :name="cmd.icon"
                      class="w-4 h-4 text-gray-600 dark:text-gray-400"
                    />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {{ cmd.label }}
                    </p>
                    <p
                      v-if="cmd.description"
                      class="text-xs text-gray-400 dark:text-gray-600 truncate"
                    >
                      {{ cmd.description }}
                    </p>
                  </div>
                  <kbd
                    v-if="cmd.shortcut"
                    class="flex-shrink-0 px-1.5 py-0.5 text-[10px] font-mono bg-gray-100 dark:bg-gray-800 text-gray-500 rounded"
                  >
                    {{ cmd.shortcut }}
                  </kbd>
                </button>
              </template>
            </template>
            <div
              v-else
              class="py-10 text-center text-sm text-gray-400 dark:text-gray-600"
            >
              {{ $t('ai.noCommandsFound') }}
            </div>
          </div>

          <div class="px-4 py-2.5 border-t border-gray-100 dark:border-gray-800 flex items-center gap-4 text-[10px] text-gray-400 dark:text-gray-600">
            <span class="flex items-center gap-1">
              <kbd class="bg-gray-100 dark:bg-gray-800 px-1 rounded">↑↓</kbd> navigate
            </span>
            <span class="flex items-center gap-1">
              <kbd class="bg-gray-100 dark:bg-gray-800 px-1 rounded">↵</kbd> select
            </span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface Command {
  id: string
  label: string
  description?: string
  icon: string
  shortcut?: string
  action: () => void
}

interface CommandGroup {
  label: string
  commands: Command[]
}

const aiStore = useAiStore()
const router = useRouter()
const localePath = useLocalePath()
const { t } = useI18n()

const query = ref('')
const highlightedId = ref<string | null>(null)
const inputEl = ref<HTMLInputElement | null>(null)

const commandGroups = computed<CommandGroup[]>(() => [
  {
    label: t('ai.commandGroupAI'),
    commands: [
      {
        id: 'ai.new',
        label: t('ai.commandNewChat'),
        description: t('ai.commandNewChatDesc'),
        icon: 'i-heroicons-plus-circle',
        shortcut: 'N',
        action: () => {
          aiStore.createConversation()
          aiStore.panelOpen = true
        },
      },
      {
        id: 'ai.panel',
        label: t('ai.commandTogglePanel'),
        description: t('ai.commandTogglePanelDesc'),
        icon: 'i-heroicons-sparkles',
        shortcut: 'A',
        action: () => {
          aiStore.panelOpen = !aiStore.panelOpen
        },
      },
      {
        id: 'ai.prompts',
        label: t('ai.commandBrowsePrompts'),
        description: t('ai.commandBrowsePromptsDesc'),
        icon: 'i-heroicons-bolt',
        action: () => { aiStore.promptPickerOpen = true },
      },
      {
        id: 'ai.clear',
        label: t('ai.commandClearChat'),
        icon: 'i-heroicons-trash',
        action: () => {
          if (aiStore.activeConversationId) {
            aiStore.deleteConversation(aiStore.activeConversationId)
          }
        },
      },
    ],
  },
  {
    label: t('ai.commandGroupNav'),
    commands: [
      {
        id: 'nav.dashboard',
        label: t('nav.dashboard'),
        icon: 'i-heroicons-home',
        action: () => router.push(localePath('/dashboard')),
      },
      {
        id: 'nav.ai',
        label: t('nav.ai'),
        description: t('ai.commandGoToAIPage'),
        icon: 'i-heroicons-cpu-chip',
        action: () => router.push(localePath('/dashboard/ai')),
      },
      {
        id: 'nav.settings',
        label: t('nav.settings'),
        icon: 'i-heroicons-cog-6-tooth',
        action: () => router.push(localePath('/dashboard/settings')),
      },
    ],
  },
])

const allFlat = computed(() => commandGroups.value.flatMap(g => g.commands))

const filteredGroups = computed(() => {
  if (!query.value.trim()) return commandGroups.value
  const q = query.value.toLowerCase()
  return commandGroups.value
    .map(g => ({
      ...g,
      commands: g.commands.filter(
        c => c.label.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q),
      ),
    }))
    .filter(g => g.commands.length > 0)
})

watch(() => aiStore.commandPaletteOpen, (open) => {
  if (open) {
    query.value = ''
    highlightedId.value = allFlat.value[0]?.id ?? null
    nextTick(() => inputEl.value?.focus())
  }
})

function moveDown() {
  const flat = allFlat.value
  const idx = flat.findIndex(c => c.id === highlightedId.value)
  highlightedId.value = flat[(idx + 1) % flat.length]?.id ?? null
}

function moveUp() {
  const flat = allFlat.value
  const idx = flat.findIndex(c => c.id === highlightedId.value)
  highlightedId.value = flat[(idx - 1 + flat.length) % flat.length]?.id ?? null
}

function run(cmd: Command) {
  cmd.action()
  aiStore.commandPaletteOpen = false
}

function runHighlighted() {
  const cmd = allFlat.value.find(c => c.id === highlightedId.value)
  if (cmd) run(cmd)
}
</script>
