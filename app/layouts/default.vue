<template>
  <div class="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-600 focus:text-white focus:rounded-md"
    >
      {{ $t('common.skipToContent') }}
    </a>
    <WebsiteHeader />
    <main
      id="main-content"
      class="flex-1"
    >
      <slot />
    </main>
    <WebsiteFooter />
  </div>
</template>
