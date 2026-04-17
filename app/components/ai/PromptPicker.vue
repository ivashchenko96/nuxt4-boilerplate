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
        v-if="aiStore.promptPickerOpen"
        class="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4"
        @click.self="aiStore.promptPickerOpen = false"
      >
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-black/40 backdrop-blur-sm"
          @click="aiStore.promptPickerOpen = false"
        />

        <!-- Modal -->
        <div class="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <!-- Search header -->
          <div class="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <UIcon
              name="i-heroicons-magnifying-glass"
              class="w-4 h-4 text-gray-400 flex-shrink-0"
            />
            <input
              ref="searchEl"
              v-model="searchQuery"
              type="text"
              :placeholder="$t('ai.promptSearchPlaceholder')"
              class="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
              @keydown.escape="aiStore.promptPickerOpen = false"
              @keydown.down.prevent="moveDown"
              @keydown.up.prevent="moveUp"
              @keydown.enter.prevent="selectHighlighted"
            >
            <kbd class="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-gray-100 dark:bg-gray-800 text-gray-500 rounded">
              ESC
            </kbd>
          </div>

          <!-- Results -->
          <div
            ref="listEl"
            class="overflow-y-auto max-h-[340px] py-1"
          >
            <!-- Group headers + items -->
            <template v-if="filteredGroups.length">
              <template
                v-for="group in filteredGroups"
                :key="group.id"
              >
                <div class="px-3 py-1.5">
                  <p class="text-[10px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
                    <UIcon
                      :name="group.icon"
                      class="w-3 h-3"
                    />
                    {{ group.label }}
                  </p>
                </div>
                <button
                  v-for="prompt in group.prompts"
                  :key="prompt.id"
                  type="button"
                  :class="[
                    'w-full flex items-start gap-3 px-4 py-2.5 text-left transition-colors',
                    highlightedId === prompt.id
                      ? 'bg-brand-50 dark:bg-brand-900/20'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800',
                  ]"
                  @mouseenter="highlightedId = prompt.id"
                  @click="selectPrompt(prompt)"
                >
                  <UIcon
                    :name="prompt.icon ?? 'i-heroicons-chat-bubble-left'"
                    class="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5"
                  />
                  <div class="min-w-0">
                    <p class="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {{ prompt.label }}
                    </p>
                    <p
                      v-if="prompt.description"
                      class="text-xs text-gray-400 dark:text-gray-600 mt-0.5 truncate"
                    >
                      {{ prompt.description }}
                    </p>
                  </div>
                </button>
              </template>
            </template>

            <!-- Empty search state -->
            <div
              v-else
              class="py-10 text-center text-sm text-gray-400 dark:text-gray-600"
            >
              {{ $t('ai.noPromptsFound') }}
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { PromptTemplate } from '~~/shared/types/ai'

const emit = defineEmits<{
  select: [promptId: string, prefillText: string]
}>()

const aiStore = useAiStore()
const { allGroups, searchPrompts, buildPrompt } = usePrompts()

const searchQuery = ref('')
const highlightedId = ref<string | null>(null)
const searchEl = ref<HTMLInputElement | null>(null)

const filteredGroups = computed(() => {
  if (!searchQuery.value.trim()) return allGroups
  const found = searchPrompts(searchQuery.value)
  return allGroups
    .map(g => ({ ...g, prompts: g.prompts.filter(p => found.some(f => f.id === p.id)) }))
    .filter(g => g.prompts.length > 0)
})

const allFlatFiltered = computed<PromptTemplate[]>(() =>
  filteredGroups.value.flatMap(g => g.prompts),
)

// Focus search on open
watch(() => aiStore.promptPickerOpen, (open) => {
  if (open) {
    searchQuery.value = ''
    highlightedId.value = null
    nextTick(() => searchEl.value?.focus())
  }
})

function selectPrompt(prompt: PromptTemplate) {
  // If prompt has no required variables, build the prompt text directly
  const hasVariables = prompt.variables?.some(v => v.required)
  const prefill = hasVariables ? '' : buildPrompt(prompt)
  emit('select', prompt.id, prefill || prompt.template)
  aiStore.promptPickerOpen = false
}

function moveDown() {
  const items = allFlatFiltered.value
  if (!items.length) return
  const idx = items.findIndex(p => p.id === highlightedId.value)
  highlightedId.value = items[(idx + 1) % items.length]?.id ?? null
}

function moveUp() {
  const items = allFlatFiltered.value
  if (!items.length) return
  const idx = items.findIndex(p => p.id === highlightedId.value)
  highlightedId.value = items[(idx - 1 + items.length) % items.length]?.id ?? null
}

function selectHighlighted() {
  const prompt = allFlatFiltered.value.find(p => p.id === highlightedId.value)
  if (prompt) selectPrompt(prompt)
}
</script>
