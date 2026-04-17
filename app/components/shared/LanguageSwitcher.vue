<template>
  <select
    :value="locale"
    class="text-sm border border-gray-200 dark:border-gray-700 rounded-md px-2 py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300"
    :aria-label="$t('common.language')"
    @change="onLocaleChange"
  >
    <option
      v-for="l in locales"
      :key="l.code"
      :value="l.code"
    >
      {{ l.name }}
    </option>
  </select>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const router = useRouter()

async function onLocaleChange(event: Event) {
  const val = (event.target as HTMLSelectElement).value
  await setLocale(val)
  await router.push(switchLocalePath(val))
}
</script>
