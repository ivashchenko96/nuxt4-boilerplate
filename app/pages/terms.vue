<template>
  <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
      {{ $t('footer.terms') }}
    </h1>
    <p class="text-gray-600 dark:text-gray-300 leading-7">
      By using this platform, you agree to acceptable use, security, and compliance requirements.
      Access may be suspended for abuse, and continued use indicates acceptance of updates to these terms.
    </p>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
</script>
