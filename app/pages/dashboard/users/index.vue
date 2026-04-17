<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ $t('users.title') }}
        </h1>
        <p class="text-gray-500 text-sm mt-1">
          {{ $t('users.subtitle') }}
        </p>
      </div>
      <UButton
        icon="i-heroicons-user-plus"
        color="primary"
        @click="showCreateModal = true"
      >
        {{ $t('users.addUser') }}
      </UButton>
    </div>

    <BaseDataTable
      :columns="columns"
      :rows="filteredUsers"
      :total="total"
      :loading="isLoading"
      :aria-label="$t('users.tableAriaLabel')"
      @update:state="onTableStateChange"
    >
      <template #cell-status="{ value }">
        <UBadge
          :color="value === 'active' ? 'success' : 'neutral'"
          variant="soft"
          size="sm"
        >
          {{ value }}
        </UBadge>
      </template>
      <template #cell-actions="{ row }">
        <div class="flex items-center gap-1">
          <UButton
            variant="ghost"
            size="xs"
            icon="i-heroicons-pencil"
            :aria-label="$t('common.edit')"
            @click="editUser(row as unknown as UserRow)"
          />
          <UButton
            variant="ghost"
            size="xs"
            color="error"
            icon="i-heroicons-trash"
            :aria-label="$t('common.delete')"
            @click="deleteUser(row as unknown as UserRow)"
          />
        </div>
      </template>
    </BaseDataTable>
  </div>
</template>

<script setup lang="ts">
import type { TableColumn, TableState } from '~~/shared/types'

definePageMeta({ layout: 'dashboard', middleware: ['auth'] })

const { t } = useI18n()

useSeo({ title: t('users.title'), noIndex: true })

interface UserRow {
  id: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
  createdAt: string
  actions: null
}

const isLoading = ref(false)
const showCreateModal = ref(false)
const tableState = ref<TableState>({
  page: 1,
  perPage: 10,
  sortKey: 'name',
  sortOrder: 'asc',
  filters: [],
  search: '',
})

const columns: TableColumn<UserRow>[] = [
  { key: 'name', label: t('users.name'), sortable: true },
  { key: 'email', label: t('users.email'), sortable: true },
  { key: 'role', label: t('users.role'), sortable: true },
  { key: 'status', label: t('users.status') },
  { key: 'createdAt', label: t('users.createdAt'), sortable: true },
  { key: 'actions', label: '', align: 'right' },
]

const mockUsers: UserRow[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'admin', status: 'active', createdAt: '2024-01-15', actions: null },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'user', status: 'active', createdAt: '2024-02-20', actions: null },
  { id: '3', name: 'Carol Davis', email: 'carol@example.com', role: 'manager', status: 'inactive', createdAt: '2024-03-10', actions: null },
  { id: '4', name: 'David Wilson', email: 'david@example.com', role: 'user', status: 'active', createdAt: '2024-04-05', actions: null },
  { id: '5', name: 'Eva Martinez', email: 'eva@example.com', role: 'user', status: 'active', createdAt: '2024-05-12', actions: null },
]

const filteredUsers = computed(() => {
  let users = [...mockUsers]
  if (tableState.value.search) {
    const q = tableState.value.search.toLowerCase()
    users = users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
  }
  if (tableState.value.sortKey) {
    const key = tableState.value.sortKey as keyof UserRow
    users.sort((a, b) => {
      const aVal = String(a[key] ?? '')
      const bVal = String(b[key] ?? '')
      return tableState.value.sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    })
  }
  return users
})

const total = computed(() => filteredUsers.value.length)

function onTableStateChange(state: TableState) {
  tableState.value = state
}

function editUser(user: UserRow) {
  console.log('Edit user', user)
}

function deleteUser(user: UserRow) {
  console.log('Delete user', user)
}
</script>
