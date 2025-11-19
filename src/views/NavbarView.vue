<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/useUserStore'

const router = useRouter()
const userStore = useUserStore()

const name = computed(() => userStore.name)
const email = computed(() => userStore.email)

</script>

<template>
  <div class="navbar">
    <div class="navbar-start">
      <RouterLink to="/" class="navbar-item">Home</RouterLink>
      <RouterLink to="/dashboard" class="navbar-item">Dashboard</RouterLink>
    </div>
    <div class="navbar-end" v-if="userStore.isLoggedIn">
      <div class="navbar-item">
        Welcome, {{ name }} ({{ email }})
      </div>
      <div class="navbar-item">
        <button @click="userStore.logout(); router.push('/')" class="button is-light">
          Logout
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>