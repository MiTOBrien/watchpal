<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/useUserStore'
import { PASSWORD_REGEX, isValidPassword } from '@/utils/passwordRules'

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL
const email = ref('')
const name = ref('')
const password = ref('')
const showPassword = ref(false)
const confirmPassword = ref('')
const showConfirmPassword = ref(false)
const acceptedTOS = ref(false)

const isPasswordValid = computed(() => isValidPassword(password.value))
const doPasswordsMatch = computed(() => password.value === confirmPassword.value)

const emit = defineEmits(['close', 'open-login'])

const openLogin = () => {
  emit('close')
  emit('open-login')
}

const router = useRouter()
const userStore = useUserStore()

const register = async () => {
  if (!isPasswordValid.value) {
    alert('Password does not meet complexity requirements')
    return
  }

  if (!doPasswordsMatch.value) {
    alert('Passwords do not match')
    return
  }

  if (!acceptedTOS.value) {
    alert('You must acknowledge the Terms of Service to register.')
    return
  }

  try {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: {
          email: email.value,
          name: name.value,
          password: password.value,
          confirm_password: confirmPassword.value,
          tos_accepted: acceptedTOS.value,
        },
      }),
    })

    const data = await response.json()

    if (response.ok) {
      alert('Registration successful! Please login.')
      userStore.showRegisterModal = false
    } else {
      alert(data.error || 'Registration failed')
    }
  } catch (error) {
    console.error(error)
    alert('An error occurred during registration')
  }
}
</script>

<template>
  <main>
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="registration-form">
        <button class="close-btn" @click="$emit('close')">×</button>
        <form @submit.prevent="register">
          <div class="form-group">
            <label for="email">Email address:</label>
            <input
              v-model="email"
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email address"
              required
            />
          </div>

          <div class="form-group">
            <label for="name">Name:</label>
            <input
              v-model="name"
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              required
            />
          </div>

          <!-- Password Field -->
          <div class="form-group password-wrapper">
            <p v-if="!isPasswordValid" class="validation-message">
              Password must be at least 8 characters and include uppercase, lowercase, and a number
              or symbol.
            </p>
            <label for="password">Password:</label>
            <div class="password-field">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                id="password"
                name="password"
                placeholder="Enter your password"
                required
              />
              <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                {{ showPassword ? 'Hide' : 'Show' }}
              </button>
            </div>
          </div>

          <!-- Confirm Password Field -->
          <div class="form-group password-wrapper">
            <p v-if="!doPasswordsMatch" class="validation-message">Passwords do not match.</p>
            <label for="confirmpassword">Confirm Password:</label>
            <div class="password-field">
              <input
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                id="confirmpassword"
                name="confirmpassword"
                placeholder="Confirm your password"
                required
              />
              <button
                type="button"
                class="toggle-password"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                {{ showConfirmPassword ? 'Hide' : 'Show' }}
              </button>
            </div>
          </div>

          <div class="form-group">
            <label>
              <input type="checkbox" v-model="acceptedTOS" />
              I acknowledge and agree to the
              <router-link to="/tos" target="_blank">Terms of Service</router-link>.
            </label>
          </div>

          <button
            type="submit"
            class="submit-btn"
            :disabled="!isPasswordValid || !doPasswordsMatch"
          >
            Register
          </button>
        </form>
        
        <p class="login-link">
          <button type="button" class="link-button" @click="openLogin">Back to login</button>
        </p>
      </div>
    </div>
  </main>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  color: #333;
}

main {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

.registration-form {
  position: relative;
  background: #f9f9f9;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
}

.password-field {
  display: flex;
  align-items: center;
  position: relative;
}

.password-field input {
  flex: 1;
  padding-right: 4rem;
}

.toggle-password {
  position: absolute;
  right: 0.5rem;
  background: none;
  border: none;
  color: #2563eb;
  font-weight: 500;
  cursor: pointer;
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 1rem;
}

.submit-btn:hover {
  background-color: #0056b3;
}

.back-link {
  text-align: center;
  margin-top: 1rem;
}

/* Responsive design */
@media (max-width: 768px) {
  .plan-options {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {

  main {
    padding: 1rem;
    max-width: 100%;
  }

  .registration-form {
    padding: 1.5rem;
  }
}
</style>
