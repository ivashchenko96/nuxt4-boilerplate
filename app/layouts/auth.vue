<template>
  <div class="min-h-screen bg-gradient-to-br from-brand-950 via-gray-900 to-gray-950 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 text-white text-2xl font-bold"
        >
          <UIcon
            name="i-heroicons-building-office-2"
            class="w-8 h-8 text-brand-400"
          />
          {{ config.public.appName }}
        </NuxtLink>
      </div>
      <div class="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
</script>
