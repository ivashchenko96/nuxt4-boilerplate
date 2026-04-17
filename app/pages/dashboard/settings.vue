<template>
  <div class="space-y-6 max-w-2xl">
    <div>
      <h1 class="text-3xl font-editorial text-ink">
        {{ $t('settings.title') }}
      </h1>
      <p class="text-muted text-sm mt-2">
        {{ $t('settings.subtitle') }}
      </p>
    </div>

    <div class="ui-panel p-6 space-y-4">
      <h2 class="text-xl font-editorial text-ink">
        {{ $t('settings.profile') }}
      </h2>
      <div class="flex items-center gap-4">
        <UAvatar
          :alt="user?.name"
          size="xl"
          class="bg-brand-500 text-white"
        />
        <div>
          <p class="font-medium text-ink">
            {{ user?.name }}
          </p>
          <p class="text-sm text-muted">
            {{ user?.email }}
          </p>
        </div>
      </div>
      <UForm
        :state="profileForm"
        class="space-y-4"
        @submit="saveProfile"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UFormField
            :label="$t('settings.name')"
            name="name"
          >
            <UInput
              v-model="profileForm.name"
              class="w-full"
            />
          </UFormField>
          <UFormField
            :label="$t('settings.email')"
            name="email"
          >
            <UInput
              v-model="profileForm.email"
              type="email"
              class="w-full"
            />
          </UFormField>
        </div>
        <UButton
          type="submit"
          color="primary"
          :loading="savingProfile"
        >
          {{ $t('settings.saveProfile') }}
        </UButton>
      </UForm>
    </div>

    <div class="ui-panel p-6 space-y-4">
      <h2 class="text-xl font-editorial text-ink">
        {{ $t('settings.preferences') }}
      </h2>
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-ink">
              {{ $t('settings.darkMode') }}
            </p>
            <p class="text-xs text-muted">
              {{ $t('settings.darkModeDesc') }}
            </p>
          </div>
          <input
            type="checkbox"
            :checked="isDarkMode"
            class="w-4 h-4 accent-brand-600 cursor-pointer"
            @change="toggleDarkMode"
          >
        </div>
        <hr class="border-soft">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-ink">
              {{ $t('settings.language') }}
            </p>
            <p class="text-xs text-muted">
              {{ $t('settings.languageDesc') }}
            </p>
          </div>
          <SharedLanguageSwitcher />
        </div>
      </div>
    </div>

    <div class="ui-panel p-6 space-y-5">
      <div class="flex items-center gap-2">
        <UIcon
          name="i-heroicons-sparkles"
          class="w-5 h-5 text-brand-600"
        />
        <h2
          id="ai"
          class="text-xl font-editorial text-ink"
        >
          {{ $t('settings.ai') }}
        </h2>
      </div>

      <div class="space-y-4">
        <!-- Enable AI -->
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-ink">
              {{ $t('settings.aiEnabled') }}
            </p>
            <p class="text-xs text-muted">
              {{ $t('settings.aiEnabledDesc') }}
            </p>
          </div>
          <input
            type="checkbox"
            :checked="aiStore.settings.enabled"
            class="w-4 h-4 accent-brand-600 cursor-pointer"
            @change="aiStore.updateSettings({ enabled: ($event.target as HTMLInputElement).checked })"
          >
        </div>

        <hr class="border-soft">

        <!-- Provider base URL -->
        <UFormField
          :label="$t('settings.aiBaseUrl')"
          name="aiBaseUrl"
          :description="$t('settings.aiBaseUrlDesc')"
        >
          <UInput
            :model-value="aiStore.settings.provider.baseUrl"
            class="w-full font-mono text-sm"
            placeholder="https://api.openai.com/v1"
            @update:model-value="aiStore.updateProviderConfig({ baseUrl: String($event) })"
          />
        </UFormField>

        <!-- Model ID -->
        <UFormField
          :label="$t('settings.aiModel')"
          name="aiModel"
          :description="$t('settings.aiModelDesc')"
        >
          <UInput
            :model-value="aiStore.settings.provider.modelId"
            class="w-full font-mono text-sm"
            placeholder="gpt-4o"
            @update:model-value="aiStore.updateProviderConfig({ modelId: String($event) })"
          />
        </UFormField>

        <!-- Streaming toggle -->
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-ink">
              {{ $t('settings.aiStreaming') }}
            </p>
            <p class="text-xs text-muted">
              {{ $t('settings.aiStreamingDesc') }}
            </p>
          </div>
          <input
            type="checkbox"
            :checked="aiStore.settings.streamingEnabled"
            class="w-4 h-4 accent-brand-600 cursor-pointer"
            @change="aiStore.updateSettings({ streamingEnabled: ($event.target as HTMLInputElement).checked })"
          >
        </div>

        <!-- System prompt override -->
        <UFormField
          :label="$t('settings.aiSystemPrompt')"
          name="aiSystemPrompt"
          :description="$t('settings.aiSystemPromptDesc')"
        >
          <textarea
            :value="aiStore.settings.systemPromptOverride ?? ''"
            rows="4"
            class="w-full resize-y rounded-lg border border-soft bg-paper text-sm text-ink px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent placeholder:text-muted"
            :placeholder="$t('settings.aiSystemPromptPlaceholder')"
            @input="aiStore.updateSettings({ systemPromptOverride: ($event.target as HTMLTextAreaElement).value || undefined })"
          />
        </UFormField>

        <!-- Open AI page -->
        <UButton
          color="primary"
          variant="soft"
          icon="i-heroicons-sparkles"
          :to="localePath('/dashboard/ai')"
        >
          {{ $t('settings.openAiAssistant') }}
        </UButton>
      </div>
    </div>

    <div class="ui-panel p-6 space-y-4 border-red-200 dark:border-red-900">
      <h2 class="text-xl font-editorial text-red-600 dark:text-red-400">
        {{ $t('settings.dangerZone') }}
      </h2>
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-ink">
            {{ $t('settings.signOut') }}
          </p>
          <p class="text-xs text-muted">
            {{ $t('settings.signOutDesc') }}
          </p>
        </div>
        <UButton
          color="error"
          variant="soft"
          @click="logout"
        >
          {{ $t('auth.logout') }}
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: ['auth'] })

const { user, logout } = useAuth()
const colorMode = useColorMode()
const { t } = useI18n()
const aiStore = useAiStore()

useSeo({ title: t('settings.title'), noIndex: true })

const savingProfile = ref(false)
const isDarkMode = ref(colorMode.value === 'dark')
const localePath = useLocalePath()

const profileForm = reactive({
  name: user.value?.name ?? '',
  email: user.value?.email ?? '',
})

function toggleDarkMode(event: Event) {
  const checked = (event.target as HTMLInputElement).checked
  isDarkMode.value = checked
  colorMode.preference = checked ? 'dark' : 'light'
}

async function saveProfile() {
  savingProfile.value = true
  await new Promise(resolve => setTimeout(resolve, 800))
  savingProfile.value = false
}
</script>
