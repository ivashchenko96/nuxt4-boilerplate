<template>
  <span
    class="inline-block w-0.5 h-4 bg-current align-middle ml-0.5"
    :class="visible ? 'opacity-100' : 'opacity-0'"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
const visible = ref(true)
let timer: ReturnType<typeof setInterval>

onMounted(() => {
  timer = setInterval(() => {
    visible.value = !visible.value
  }, 530)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>
