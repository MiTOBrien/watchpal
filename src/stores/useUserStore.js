import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref(null)
  const token = ref(null)
  const id = ref(null)
  const email = ref('')
  const name = ref('')
  const subscribed = ref(false)
  const subscriptionId = ref(null)
  const isLoggedIn = ref(false)
  const disabled = ref(false)
  const showLoginModal = ref(false)
  const showRegisterModal = ref(false)
  const shows = ref([])

  // Actions
  function login(userData) {
    token.value = userData.token
    user.value = userData
    id.value = userData.id
    email.value = userData.email
    name.value = userData.name
    subscribed.value = !!userData.subscribed
    subscriptionId.value = userData.subscription_id || null
    disabled.value = !!userData.disabled
    isLoggedIn.value = true
    showLoginModal.value = false
    showRegisterModal.value = false
    shows.value = userData.shows || []

    localStorage.setItem(
      'user',
      JSON.stringify({
        ...userData,
      }),
    )
  }

  function setUser(userData) {
    const currentToken = token.value
    login({
      ...userData,
      token: userData.token || currentToken,
    })
  }

  function logout() {
    token.value = null
    id.value = null
    email.value = ''
    name.value = ''
    subscribed.value = false
    subscriptionId.value = null
    disabled.value = false
    isLoggedIn.value = false
    shows.value = []

    localStorage.removeItem('user')
  }

  function restoreFromLocalStorage() {
    const stored = localStorage.getItem('user')
    if (stored) {
      const userData = JSON.parse(stored)
      login(userData)
    }
  }

  function setShows(showList) {
    shows.value = showList || []
  }

  function addShow(newShow) {
    shows.value.push(newShow)
  }

  async function fetchShows() {
    if (!token.value) return
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_BASE_URL}/api/v1/shows`, {
        headers: {
          Authorization: `Bearer ${token.value}`,
          Accept: 'application/json',
        },
      })
      const result = await response.json()
      if (response.ok) {
        setShows(result.data)
      } else {
        console.error('Failed to fetch shows:', result.error || result.message)
      }
    } catch (error) {
      console.error('Error fetching shows:', error)
    }
  }

  return {
    // State
    user,
    token,
    id,
    email,
    name,
    subscribed,
    subscriptionId,
    isLoggedIn,
    disabled,
    shows,

    // Actions
    login,
    setUser,
    logout,
    restoreFromLocalStorage,
    setShows,
    addShow,
    fetchShows,
  }
})
