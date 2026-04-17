<template>
  <footer class="bg-gray-900 dark:bg-gray-950 text-gray-400">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div class="md:col-span-1">
          <div class="flex items-center gap-2 text-white font-bold text-lg mb-4">
            <UIcon
              name="i-heroicons-building-office-2"
              class="w-6 h-6 text-brand-400"
            />
            {{ config.public.appName }}
          </div>
          <p class="text-sm">
            {{ $t('footer.tagline') }}
          </p>
        </div>
        <div>
          <h3 class="text-white font-semibold text-sm uppercase tracking-wider mb-4">
            {{ $t('footer.product') }}
          </h3>
          <ul class="space-y-2 text-sm">
            <li>
              <NuxtLink
                :to="localePath('/')"
                class="hover:text-white transition-colors"
              >{{ $t('nav.home') }}</NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="localePath('/about')"
                class="hover:text-white transition-colors"
              >{{ $t('nav.about') }}</NuxtLink>
            </li>
          </ul>
        </div>
        <div>
          <h3 class="text-white font-semibold text-sm uppercase tracking-wider mb-4">
            {{ $t('footer.legal') }}
          </h3>
          <ul class="space-y-2 text-sm">
            <li>
              <NuxtLink
                :to="localePath('/privacy')"
                class="hover:text-white transition-colors"
              >{{ $t('footer.privacy') }}</NuxtLink>
            </li>
            <li>
              <NuxtLink
                :to="localePath('/terms')"
                class="hover:text-white transition-colors"
              >{{ $t('footer.terms') }}</NuxtLink>
            </li>
          </ul>
        </div>
        <div>
          <h3 class="text-white font-semibold text-sm uppercase tracking-wider mb-4">
            {{ $t('footer.social') }}
          </h3>
          <div class="flex gap-3">
            <a
              href="#"
              class="hover:text-white transition-colors"
              :aria-label="$t('footer.githubLink')"
            >
              <UIcon
                name="i-simple-icons-github"
                class="w-5 h-5"
              />
            </a>
            <a
              href="#"
              class="hover:text-white transition-colors"
              :aria-label="$t('footer.twitterLink')"
            >
              <UIcon
                name="i-simple-icons-x"
                class="w-5 h-5"
              />
            </a>
          </div>
        </div>
      </div>
      <div class="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
        <p>{{ $t('footer.copyright', { year: new Date().getFullYear(), name: config.public.appName }) }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const localePath = useLocalePath()
</script>
