<template>
  <div class="min-h-screen bg-paper text-ink flex items-center justify-center p-6">
    <div class="w-full max-w-lg">
      <div class="text-center mb-10">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 text-xl md:text-2xl font-semibold text-ink font-editorial"
        >
          <UIcon
            name="i-heroicons-building-office-2"
            class="w-7 h-7 text-brand-500"
          />
          {{ config.public.appName }}
        </NuxtLink>
      </div>
      <div class="ui-panel p-8 md:p-10">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
</script>
