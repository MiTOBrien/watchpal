<script setup>
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/useUserStore'
import NavbarView from './views/NavbarView.vue'
import FooterView from './views/FooterView.vue'

const userStore = useUserStore()

onMounted(() => {
  userStore.restoreFromLocalStorage()
  document.documentElement.dataset.theme = 'dark'
})
</script>

<template>
  <NavbarView />
  <RouterView />
  <FooterView />
</template>

<style scoped>
</style>
