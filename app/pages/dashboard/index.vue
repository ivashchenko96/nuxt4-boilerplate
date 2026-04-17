<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-editorial text-ink">
        {{ $t('dashboard.welcome', { name: user?.name }) }}
      </h1>
      <p class="text-muted text-sm mt-2">
        {{ $t('dashboard.subtitle') }}
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <BaseStatsCard
        v-for="stat in stats"
        :key="stat.label"
        :label="stat.label"
        :value="stat.value"
        :icon="stat.icon"
        :color="stat.color"
        :trend="stat.trend"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="ui-panel p-6">
        <h2 class="text-xl font-editorial text-ink mb-4">
          {{ $t('dashboard.activityChart') }}
        </h2>
        <div class="h-48 flex items-center justify-center text-muted">
          <div class="text-center">
            <UIcon
              name="i-heroicons-chart-bar"
              class="w-12 h-12 mx-auto mb-2"
            />
            <p class="text-sm">
              {{ $t('dashboard.chartPlaceholder') }}
            </p>
          </div>
        </div>
      </div>

      <div class="ui-panel p-6">
        <h2 class="text-xl font-editorial text-ink mb-4">
          {{ $t('dashboard.recentActivity') }}
        </h2>
        <ul class="space-y-3">
          <li
            v-for="activity in recentActivity"
            :key="activity.id"
            class="flex items-start gap-3"
          >
            <div class="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
              <UIcon
                :name="activity.icon"
                class="w-4 h-4 text-brand-700"
              />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-ink">
                {{ activity.message }}
              </p>
              <p class="text-xs text-muted mt-0.5">
                {{ activity.time }}
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="ui-panel p-6">
      <h2 class="text-xl font-editorial text-ink mb-4">
        {{ $t('dashboard.quickActions') }}
      </h2>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <UButton
          v-for="action in quickActions"
          :key="action.label"
          :to="localePath(action.to)"
          variant="soft"
          color="primary"
          class="flex-col h-20 gap-2"
        >
          <UIcon
            :name="action.icon"
            class="w-6 h-6"
          />
          <span class="text-xs">{{ action.label }}</span>
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: ['auth'] })

const localePath = useLocalePath()
const { user } = useAuth()
const { t } = useI18n()

useSeo({ title: t('nav.dashboard'), noIndex: true })

const stats = computed(() => [
  { label: t('dashboard.stats.users'), value: '2,847', icon: 'i-heroicons-users', color: 'blue' as const, trend: 12 },
  { label: t('dashboard.stats.revenue'), value: '$48,295', icon: 'i-heroicons-currency-dollar', color: 'green' as const, trend: 8 },
  { label: t('dashboard.stats.orders'), value: '1,203', icon: 'i-heroicons-shopping-cart', color: 'purple' as const, trend: -3 },
  { label: t('dashboard.stats.uptime'), value: '99.9%', icon: 'i-heroicons-server', color: 'orange' as const, trend: 0 },
])

const recentActivity = [
  { id: 1, icon: 'i-heroicons-user-plus', message: t('dashboard.activity.newUser'), time: '2m ago' },
  { id: 2, icon: 'i-heroicons-document-check', message: t('dashboard.activity.reportGenerated'), time: '15m ago' },
  { id: 3, icon: 'i-heroicons-cog-6-tooth', message: t('dashboard.activity.settingsUpdated'), time: '1h ago' },
  { id: 4, icon: 'i-heroicons-arrow-right-on-rectangle', message: t('dashboard.activity.userLoggedIn'), time: '2h ago' },
]

const quickActions = computed(() => [
  { label: t('nav.users'), icon: 'i-heroicons-user-plus', to: '/dashboard/users' },
  { label: t('nav.reports'), icon: 'i-heroicons-chart-bar', to: '/dashboard/reports' },
  { label: t('nav.settings'), icon: 'i-heroicons-cog-6-tooth', to: '/dashboard/settings' },
  { label: t('dashboard.export'), icon: 'i-heroicons-arrow-down-tray', to: '/dashboard/reports' },
])
</script>
