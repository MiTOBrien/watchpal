<script setup>
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/useUserStore'

const userStore = useUserStore()

onMounted(() => {
  userStore.restoreFromLocalStorage()
  document.documentElement.dataset.theme = 'dark'
})
</script>

<template>
  <RouterView />
</template>

<style scoped>
</style>
