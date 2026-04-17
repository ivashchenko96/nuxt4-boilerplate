<template>
  <div>
    <!-- Hero -->
    <section class="bg-gradient-to-br from-brand-950 via-gray-900 to-gray-950 py-24">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h1 class="text-4xl font-extrabold text-white mb-4">
          {{ $t('contact.title') }}
        </h1>
        <p class="text-lg text-gray-300 max-w-2xl mx-auto">
          {{ $t('contact.description') }}
        </p>
      </div>
    </section>

    <!-- Contact form -->
    <section class="py-16 bg-white dark:bg-gray-950">
      <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">{{ $t('contact.formTitle') }}</h2>

          <UForm
            :state="form"
            class="space-y-4"
            @submit="onSubmit"
          >
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <UFormField :label="$t('contact.firstName')" name="firstName">
                <UInput
                  v-model="form.firstName"
                  :placeholder="$t('contact.firstNamePlaceholder')"
                  class="w-full"
                />
              </UFormField>
              <UFormField :label="$t('contact.lastName')" name="lastName">
                <UInput
                  v-model="form.lastName"
                  :placeholder="$t('contact.lastNamePlaceholder')"
                  class="w-full"
                />
              </UFormField>
            </div>

            <UFormField :label="$t('contact.email')" name="email">
              <UInput
                v-model="form.email"
                type="email"
                :placeholder="$t('contact.emailPlaceholder')"
                icon="i-heroicons-envelope"
                class="w-full"
              />
            </UFormField>

            <UFormField :label="$t('contact.subject')" name="subject">
              <UInput
                v-model="form.subject"
                :placeholder="$t('contact.subjectPlaceholder')"
                class="w-full"
              />
            </UFormField>

            <UFormField :label="$t('contact.message')" name="message">
              <UTextarea
                v-model="form.message"
                :placeholder="$t('contact.messagePlaceholder')"
                :rows="5"
                class="w-full"
              />
            </UFormField>

            <UAlert
              v-if="submitted"
              color="success"
              variant="soft"
              :description="$t('contact.successMessage')"
              icon="i-heroicons-check-circle"
            />

            <UButton
              type="submit"
              color="primary"
              size="lg"
              block
              :loading="isSubmitting"
            >
              {{ $t('contact.sendButton') }}
            </UButton>
          </UForm>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const { t } = useI18n()

useSeo({
  title: t('contact.meta.title'),
  description: t('contact.meta.description'),
})

const isSubmitting = ref(false)
const submitted = ref(false)

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  subject: '',
  message: '',
})

async function onSubmit() {
  isSubmitting.value = true
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  submitted.value = true
  isSubmitting.value = false
  Object.assign(form, { firstName: '', lastName: '', email: '', subject: '', message: '' })
}
</script>
