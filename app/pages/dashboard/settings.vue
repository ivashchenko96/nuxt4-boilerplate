<template>
  <div class="space-y-6 max-w-2xl">
    <div>
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ $t('settings.title') }}
      </h1>
      <p class="text-gray-500 text-sm mt-1">
        {{ $t('settings.subtitle') }}
      </p>
    </div>

    <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
      <h2 class="text-base font-semibold text-gray-900 dark:text-white">
        {{ $t('settings.profile') }}
      </h2>
      <div class="flex items-center gap-4">
        <UAvatar
          :alt="user?.name"
          size="xl"
          class="bg-brand-600"
        />
        <div>
          <p class="font-medium text-gray-900 dark:text-white">
            {{ user?.name }}
          </p>
          <p class="text-sm text-gray-500">
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

    <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 space-y-4">
      <h2 class="text-base font-semibold text-gray-900 dark:text-white">
        {{ $t('settings.preferences') }}
      </h2>
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              {{ $t('settings.darkMode') }}
            </p>
            <p class="text-xs text-gray-500">
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
        <hr class="border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              {{ $t('settings.language') }}
            </p>
            <p class="text-xs text-gray-500">
              {{ $t('settings.languageDesc') }}
            </p>
          </div>
          <SharedLanguageSwitcher />
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-900 rounded-xl border border-red-200 dark:border-red-900 p-6 space-y-4">
      <h2 class="text-base font-semibold text-red-600 dark:text-red-400">
        {{ $t('settings.dangerZone') }}
      </h2>
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-gray-900 dark:text-white">
            {{ $t('settings.signOut') }}
          </p>
          <p class="text-xs text-gray-500">
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

useSeo({ title: t('settings.title'), noIndex: true })

const savingProfile = ref(false)
const isDarkMode = ref(colorMode.value === 'dark')

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
