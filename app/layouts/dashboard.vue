<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
    <DashboardSidebar />
    <div class="flex-1 flex flex-col min-w-0">
      <DashboardHeader />
      <main
        id="main-content"
        class="flex-1 p-6 overflow-auto"
      >
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
})
</script>
