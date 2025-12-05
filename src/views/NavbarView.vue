<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/useUserStore'
import LoginModal from '@/components/LoginModal.vue'
import RegisterModal from '@/components/RegisterModal.vue'

const userStore = useUserStore()
const router = useRouter()

const name = computed(() => userStore.name)

const openLoginModal = (login) => {
  userStore.showLoginModal = login
}

const handleLogout = () => {
  userStore.logout()
}

const currentTheme = ref('dark') // default to dark

const themeLabel = computed(() => (currentTheme.value === 'dark' ? 'Light Theme' : 'Dark Theme'))

const toggleTheme = () => {
  const html = document.documentElement
  currentTheme.value = currentTheme.value === 'dark' ? 'light' : 'dark'
  html.dataset.theme = currentTheme.value
}

const themeIcon = computed(() =>
  currentTheme.value === 'dark' ? '/watchpal-dark.png' : '/watchpal-light.png'
)
</script>

<template>
  <div class="navbar">
    <div class="container">
      <div class="navbar-start">
        <RouterLink to="/" class="navbar-item"
          ><img :src="themeIcon" alt="WatchPal Home" class="watchpal-icon"
        /></RouterLink>
        <button class="nav-button" @click="toggleTheme">{{ themeLabel }}</button>
      </div>

      <div class="navbar-end">
        <div v-if="userStore.isLoggedIn" class="navbar-item">
          Welcome, {{ name }}
          <button @click="handleLogout" class="button nav-button is-light">Logout</button>
        </div>
        <div v-else class="navbar-item">
          <button @click="openLoginModal" class="button nav-button is-primary">Login</button>
        </div>
      </div>
    </div>
  </div>

  <LoginModal
    v-if="userStore.showLoginModal"
    @close="userStore.showLoginModal = false"
    @open-register="
      () => {
        userStore.showLoginModal = false
        userStore.showRegisterModal = true
      }
    "
  />
  <RegisterModal
    v-if="userStore.showRegisterModal"
    @close="userStore.showRegisterModal = false"
    @open-login="
      () => {
        userStore.showRegisterModal = false
        userStore.showLoginModal = true
      }
    "
  />
</template>

<style scoped>

</style>
