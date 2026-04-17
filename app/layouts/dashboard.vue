<template>
  <div class="min-h-screen bg-paper text-ink flex">
    <DashboardSidebar />
    <div class="flex-1 flex flex-col min-w-0">
      <DashboardHeader />
      <main
        id="main-content"
        class="flex-1 p-8 overflow-auto"
      >
        <slot />
      </main>
    </div>
    <!-- AI panel — always mounted, visibility controlled by aiStore.panelOpen -->
    <AiPanel />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
})
</script>
