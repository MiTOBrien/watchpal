<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/useUserStore'
import { streamingServices } from '@/constants/services'
import AddShowModal from '@/components/AddShowModal.vue'

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL
const userStore = useUserStore()

const showAddModal = ref(false)

const selectedDay = ref(null)

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const showsByDay = (day) => {
  if (!userStore.shows) return []
  return userStore.shows.filter(
    show => show.available_on?.toLowerCase() === day.toLowerCase()
  )
}

const openAddShowModal = (day) => {
  selectedDay.value = day.toLowerCase()
  showAddModal.value = true
}

const handleAddShow = async (newShow) => {
  console.log('New show added:', newShow)
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/shows`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${userStore.user?.token}`
      },
      body: JSON.stringify({
        show: {
          show_name: newShow.show_name,
          channel_name: newShow.channel_name,
          channel_number: newShow.channel_number,
          available_on: newShow.available_on
        }
      })
    })

    const result = await response.json()

    if (response.ok) {
      // Option 1: push into local store immediately
      userStore.shows.push(result.data)

      // Option 2: or re‑fetch shows from backend
      // await userStore.fetchShows()

      alert('Show added successfully!')
    } else {
      const errorMessage =
        result.error || result.message || 'Adding show failed. Please try again.'
      alert(errorMessage)
    }
  } catch (error) {
    console.error('Add show error:', error)

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      alert(
        `Cannot connect to backend at ${API_BASE_URL}. Please check if your backend server is running.`
      )
    } else {
      alert(`An error occurred adding show: ${error.message}`)
    }
  }
}
</script>

<template>
  <div class="homeview-container">
    <main class="homeview-content">
      <h1>WatchPal</h1>
      <h2>Your watchlist companion</h2>
      <!-- Search and Filter Section -->
      <div class="search-filters">
        <div class="search-bar">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name"
            class="search-input"
          />
        </div>

        <div class="filters">
          <div class="filter-group">
            <label for="day-filter">Day of week:</label>
            <select v-model="selectedDayFilter" id="day-filter" class="filter-select">
              <option value="all">All</option>
              <option value="sunday">Sunday</option>
              <option value="monday">Monday</option>
              <option value="tuesday">Tuesday</option>
              <option value="wednesday">Wednesday</option>
              <option value="thursday">Thursday</option>
              <option value="friday">Friday</option>
              <option value="saturday">Saturday</option>
            </select>
          </div>

          <div class="filter-group">
            <label for="service-filter">Channel/Service:</label>
            <select v-model="selectedServiceFilter" id="service-filter" class="filter-select">
              <option value="all">All</option>
              <option v-for="service in streamingServices" :key="service.id" :value="service.id">
                {{ service.name }}
              </option>
            </select>
          </div>

          <button @click="clearFilters" class="clear-filters-btn">Clear Filters</button>
        </div>
      </div>

      <div class="days-column">
        <div v-for="day in daysOfWeek" :key="day" class="day-section">
          <h2 class="day-title">
            {{ day }}
            <button @click="openAddShowModal(day)" class="add-show-btn">+</button>
          </h2>
          <ul class="show-list">
            <li v-if="showsByDay(day).length === 0" class="show-item empty">
              No shows yet — add one!
            </li>
            <li v-for="show in showsByDay(day)" :key="show.id" class="show-item">
              <strong>{{ show.show_name }}</strong> — {{ show.channel_name }}
            </li>
          </ul>
        </div>
      </div>
    </main>
    <AddShowModal
      v-if="showAddModal"
      @close="showAddModal = false"
      @add-show="handleAddShow"
      :preselected-day="selectedDay"
    />
  </div>
</template>

<style scoped>
.add-show-btn {
  margin-left: 0.5rem;
  padding: 0.25rem 0.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  background: var(--color-primary);
  color: white;
  cursor: pointer;
}

.show-item.empty {
  color: var(--color-muted);
  font-style: italic;
}
</style>
