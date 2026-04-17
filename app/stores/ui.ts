import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', () => {
  const sidebarOpen = ref(true)
  const sidebarCollapsed = ref(false)
  const notifications = ref<Array<{ id: string, type: string, message: string }>>([])

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value
  }

  function toggleSidebarCollapsed() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  function addNotification(notification: { type: string, message: string }) {
    const id = Date.now().toString()
    notifications.value.push({ ...notification, id })
    setTimeout(() => removeNotification(id), 5000)
    return id
  }

  function removeNotification(id: string) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) notifications.value.splice(index, 1)
  }

  return {
    sidebarOpen,
    sidebarCollapsed,
    notifications,
    toggleSidebar,
    toggleSidebarCollapsed,
    addNotification,
    removeNotification,
  }
})
