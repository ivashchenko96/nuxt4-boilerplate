<template>
  <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
      {{ $t('footer.privacy') }}
    </h1>
    <p class="text-gray-600 dark:text-gray-300 leading-7">
      We process account and usage data only to deliver the platform, secure access, and improve reliability.
      Data is handled with least-privilege access controls, encrypted in transit, and retained according to operational and legal requirements.
    </p>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
</script>
