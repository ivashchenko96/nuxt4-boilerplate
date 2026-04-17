<template>
  <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
    <div class="flex items-center justify-between mb-4">
      <div
        :class="[
          'w-10 h-10 rounded-lg flex items-center justify-center',
          colorClasses[color || 'blue'],
        ]"
      >
        <UIcon
          :name="icon"
          class="w-5 h-5"
        />
      </div>
      <span
        v-if="trend !== undefined"
        :class="[
          'text-xs font-medium px-2 py-1 rounded-full',
          trend >= 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        ]"
      >
        {{ trend >= 0 ? '+' : '' }}{{ trend }}%
      </span>
    </div>
    <div>
      <p class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ value }}
      </p>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
        {{ label }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  icon: string
  color?: 'blue' | 'green' | 'purple' | 'orange'
  trend?: number
}>()

const colorClasses = {
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
}
</script>
