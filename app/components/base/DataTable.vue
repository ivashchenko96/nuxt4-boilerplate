<template>
  <div class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
    <div class="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3 flex-wrap">
      <UInput
        v-model="tableState.search"
        :placeholder="$t('table.search')"
        icon="i-heroicons-magnifying-glass"
        size="sm"
        class="flex-1 min-w-0 max-w-xs"
        @input="onSearch"
      />
      <slot name="filters" />
      <div class="ml-auto">
        <slot name="actions" />
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-sm text-left" role="grid" :aria-label="ariaLabel">
        <thead class="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
          <tr>
            <th
              v-for="col in columns"
              :key="String(col.key)"
              :class="[
                'px-4 py-3 font-medium',
                col.sortable ? 'cursor-pointer select-none hover:text-gray-900 dark:hover:text-white' : '',
                col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left',
              ]"
              :aria-sort="tableState.sortKey === col.key ? (tableState.sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'"
              @click="col.sortable && onSort(String(col.key))"
            >
              <div class="flex items-center gap-1" :class="col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : ''">
                {{ col.label }}
                <span v-if="col.sortable" class="text-gray-400">
                  <UIcon
                    v-if="tableState.sortKey === col.key"
                    :name="tableState.sortOrder === 'asc' ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
                    class="w-3.5 h-3.5"
                  />
                  <UIcon v-else name="i-heroicons-chevron-up-down" class="w-3.5 h-3.5 opacity-50" />
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
          <template v-if="loading">
            <tr v-for="i in tableState.perPage" :key="i" class="animate-pulse">
              <td v-for="col in columns" :key="String(col.key)" class="px-4 py-3">
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
              </td>
            </tr>
          </template>

          <tr v-else-if="!rows.length">
            <td :colspan="columns.length" class="px-4 py-12 text-center">
              <div class="flex flex-col items-center gap-3">
                <UIcon name="i-heroicons-inbox" class="w-12 h-12 text-gray-300 dark:text-gray-600" />
                <p class="text-gray-500 dark:text-gray-400 font-medium">{{ emptyText || $t('table.noData') }}</p>
              </div>
            </td>
          </tr>

          <template v-else>
            <tr
              v-for="(row, rowIndex) in rows"
              :key="rowIndex"
              class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <td
                v-for="col in columns"
                :key="String(col.key)"
                :class="[
                  'px-4 py-3 text-gray-700 dark:text-gray-300',
                  col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left',
                ]"
              >
                <slot :name="`cell-${String(col.key)}`" :row="row" :value="(row as Record<string, unknown>)[String(col.key)]">
                  {{ (row as Record<string, unknown>)[String(col.key)] }}
                </slot>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div
      v-if="total > 0"
      class="p-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between flex-wrap gap-3"
    >
      <p class="text-sm text-gray-500 dark:text-gray-400">
        {{ $t('table.showing', { from: from + 1, to: Math.min(to, total), total }) }}
      </p>
      <div class="flex items-center gap-2">
        <UButton
          variant="outline"
          size="sm"
          icon="i-heroicons-chevron-left"
          :disabled="tableState.page <= 1"
          :aria-label="$t('table.prevPage')"
          @click="onPageChange(tableState.page - 1)"
        />
        <span class="text-sm text-gray-700 dark:text-gray-300 px-2">
          {{ tableState.page }} / {{ totalPages }}
        </span>
        <UButton
          variant="outline"
          size="sm"
          icon="i-heroicons-chevron-right"
          :disabled="tableState.page >= totalPages"
          :aria-label="$t('table.nextPage')"
          @click="onPageChange(tableState.page + 1)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, unknown>">
import type { TableColumn, TableState } from '~~/shared/types'

const props = defineProps<{
  columns: TableColumn<T>[]
  rows: T[]
  total?: number
  loading?: boolean
  emptyText?: string
  ariaLabel?: string
}>()

const emit = defineEmits<{
  'update:state': [state: TableState]
}>()

const tableState = reactive<TableState>({
  page: 1,
  perPage: 10,
  sortKey: '',
  sortOrder: 'asc',
  filters: [],
  search: '',
})

const total = computed(() => props.total ?? props.rows.length)
const totalPages = computed(() => Math.ceil(total.value / tableState.perPage))
const from = computed(() => (tableState.page - 1) * tableState.perPage)
const to = computed(() => tableState.page * tableState.perPage)

function onSort(key: string) {
  if (tableState.sortKey === key) {
    tableState.sortOrder = tableState.sortOrder === 'asc' ? 'desc' : 'asc'
  }
  else {
    tableState.sortKey = key
    tableState.sortOrder = 'asc'
  }
  tableState.page = 1
  emit('update:state', { ...tableState })
}

function onSearch() {
  tableState.page = 1
  emit('update:state', { ...tableState })
}

function onPageChange(page: number) {
  tableState.page = page
  emit('update:state', { ...tableState })
}
</script>
