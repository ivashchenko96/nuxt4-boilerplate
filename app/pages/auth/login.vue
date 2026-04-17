<template>
  <div>
    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ $t('auth.loginTitle') }}</h1>
      <p class="text-gray-500 dark:text-gray-400 text-sm mt-2">{{ $t('auth.loginSubtitle') }}</p>
    </div>

    <UForm
      :state="form"
      :schema="schema"
      class="space-y-4"
      @submit="onSubmit"
    >
      <UFormField :label="$t('auth.email')" name="email">
        <UInput
          v-model="form.email"
          type="email"
          :placeholder="$t('auth.emailPlaceholder')"
          icon="i-heroicons-envelope"
          autocomplete="email"
          class="w-full"
        />
      </UFormField>

      <UFormField :label="$t('auth.password')" name="password">
        <UInput
          v-model="form.password"
          :type="showPassword ? 'text' : 'password'"
          :placeholder="$t('auth.passwordPlaceholder')"
          icon="i-heroicons-lock-closed"
          autocomplete="current-password"
          class="w-full"
          :ui="{ trailing: 'pointer-events-auto' }"
        >
          <template #trailing>
            <UButton
              variant="link"
              size="sm"
              :icon="showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'"
              :aria-label="showPassword ? $t('auth.hidePassword') : $t('auth.showPassword')"
              @click="showPassword = !showPassword"
            />
          </template>
        </UInput>
      </UFormField>

      <div class="flex items-center justify-between">
        <UCheckbox v-model="form.remember" :label="$t('auth.rememberMe')" />
        <NuxtLink
          :to="localePath('/auth/forgot-password')"
          class="text-sm text-brand-600 hover:text-brand-500 dark:text-brand-400"
        >
          {{ $t('auth.forgotPassword') }}
        </NuxtLink>
      </div>

      <UAlert
        v-if="error"
        color="error"
        variant="soft"
        :description="error"
        icon="i-heroicons-exclamation-circle"
      />

      <UButton
        type="submit"
        color="primary"
        size="lg"
        block
        :loading="isLoading"
      >
        {{ $t('auth.loginButton') }}
      </UButton>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import * as z from 'zod'

definePageMeta({ layout: 'auth' })

const localePath = useLocalePath()
const { login, isLoading, error } = useAuth()
const { t } = useI18n()

useSeo({ title: t('auth.loginTitle'), noIndex: true })

const showPassword = ref(false)

const form = reactive({
  email: '',
  password: '',
  remember: false,
})

const schema = z.object({
  email: z.string().email(t('auth.validation.emailInvalid')),
  password: z.string().min(8, t('auth.validation.passwordMin')),
})

async function onSubmit() {
  await login(form.email, form.password)
}
</script>
