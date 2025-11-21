<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/useUserStore'
import LoginModal from '@/components/LoginModal.vue'
import RegisterModal from '@/components/RegisterModal.vue'

const userStore = useUserStore()
const router = useRouter()

const name = computed(() => userStore.name)
const email = computed(() => userStore.email)

const openLoginModal = (login) => {
  userStore.showLoginModal = login
}
const openRegisterModal = (register) => {
  userStore.showRegisterModal = register
}

const handleLogout = () => {
  userStore.logout()
  router.push('/')
}
</script>

<template>
  <div class="navbar">
    <div class="navbar-start">
      <RouterLink to="/" class="navbar-item">Home</RouterLink>
    </div>

    <div class="navbar-end">
      <div v-if="userStore.isLoggedIn" class="navbar-item">
        Welcome, {{ name }}
        <button @click="handleLogout" class="button is-light">Logout</button>
      </div>
      <div v-else class="navbar-item">
        <button @click="openLoginModal" class="button is-primary">Login</button>
      </div>
    </div>

    <!-- Modals -->
    <LoginModal v-if="userStore.showLoginModal" @close="userStore.showLoginModal = false" @open-register="() => { userStore.showLoginModal = false; userStore.showRegisterModal = true }"/>
    <RegisterModal
      v-if="userStore.showRegisterModal"
      @close="userStore.showRegisterModal = false" @open-login="() => { userStore.showRegisterModal = false; userStore.showLoginModal = true }"
    />
  </div>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f0f0f0;
}

.navbar-item {
  margin: 0 0.5rem;
}

.button {
  margin-left: 0.5rem;
}
</style>
