<template>
  <UButton
    variant="ghost"
    size="sm"
    :icon="colorMode.value === 'dark' ? 'i-heroicons-sun' : 'i-heroicons-moon'"
    :aria-label="colorMode.value === 'dark' ? $t('common.lightMode') : $t('common.darkMode')"
    @click="toggleColorMode"
  />
</template>

<script setup lang="ts">
const colorMode = useColorMode()

function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>
