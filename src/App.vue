<script setup>
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/useUserStore'

const userStore = useUserStore()

onMounted(() => {
  userStore.restoreFromLocalStorage()
})
</script>

<template>
  <RouterView />
</template>

<style scoped>
</style>
