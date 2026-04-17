<template>
  <div class="ui-panel p-6">
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
          trend >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700',
        ]"
      >
        {{ trend >= 0 ? '+' : '' }}{{ trend }}%
      </span>
    </div>
    <div>
      <p class="text-2xl font-semibold text-ink">
        {{ value }}
      </p>
      <p class="text-sm text-muted mt-1">
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
  blue: 'bg-brand-100 text-brand-700',
  green: 'bg-emerald-100 text-emerald-700',
  purple: 'bg-amber-100 text-amber-700',
  orange: 'bg-orange-100 text-orange-700',
}
</script>
