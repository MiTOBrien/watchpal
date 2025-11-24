<script setup>
import { computed, ref } from 'vue'
import { useUserStore } from '@/stores/useUserStore'
import { streamingServices } from '@/constants/services'
import AddShowModal from '@/components/AddShowModal.vue'

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL
const userStore = useUserStore()
const searchQuery = ref('')
const selectedDayFilter = ref('all')
const selectedServiceFilter = ref('all')

const showAddModal = ref(false)

const selectedDay = ref(null)

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const showsByDay = (day) => {
  return filteredShows.value.filter(
    (show) => (show.available_on || show.air_day)?.toLowerCase() === day.toLowerCase(),
  )
}

const openAddShowModal = (day) => {
  selectedDay.value = day.toLowerCase()
  showAddModal.value = true
}

const handleAddShow = async (newShow) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/shows`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${userStore.user?.token}`,
      },
      body: JSON.stringify({
        show: {
          show_name: newShow.show_name,
          air_day: newShow.air_day,
          air_time: newShow.air_time,
          channel_name: newShow.channel_name,
          channel_number: newShow.channel_number,
          available_on: newShow.available_on,
        },
      }),
    })

    const result = await response.json()

    if (response.ok) {
      // Option 1: push into local store immediately
      const newShow = result.data?.attributes
      userStore.addShow(newShow)

      // Option 2: or re‑fetch shows from backend
      // await userStore.fetchShows()

      alert('Show added successfully!')
    } else {
      const errorMessage = result.error || result.message || 'Adding show failed. Please try again.'
      alert(errorMessage)
    }
  } catch (error) {
    console.error('Add show error:', error)

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      alert(
        `Cannot connect to backend at ${API_BASE_URL}. Please check if your backend server is running.`,
      )
    } else {
      alert(`An error occurred adding show: ${error.message}`)
    }
  }
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedDayFilter.value = 'all'
  selectedServiceFilter.value = 'all'
}

const filteredShows = computed(() => {
  return userStore.shows.filter((show) => {
    const matchesSearch =
      !searchQuery.value || show.show_name?.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesDay =
      selectedDayFilter.value === 'all' ||
      (show.available_on || show.air_day)?.toLowerCase() === selectedDayFilter.value

    const matchesService =
      selectedServiceFilter.value === 'all' || show.channel_name === selectedServiceFilter.value

    return matchesSearch && matchesDay && matchesService
  })
})
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
              <option v-for="service in streamingServices" :key="service.id" :value="service.name">
                {{ service.name }}
              </option>
            </select>
          </div>

          <button @click="clearFilters" class="clear-filters-btn">Clear Filters</button>
        </div>
      </div>

      <div class="days-column">
        <div v-for="day in daysOfWeek" :key="day" class="day-section">
          <h2 class="day-title" :class="{ empty: showsByDay(day).length === 0 }">
            {{ day }}
            <button @click="openAddShowModal(day)" class="add-show-btn">+</button>
          </h2>
          <ul class="show-list">
            <li v-if="showsByDay(day).length > 0" class="show-item header">
              <span>Show</span>
              <span>Channel</span>
              <span>Watch Day</span>
              <span>Air Day</span>
              <span>Air Time</span>
              <span>Channel #</span>
            </li>
            <li v-if="showsByDay(day).length === 0" class="show-item empty">
              No shows yet — add one!
            </li>
            <li v-for="show in showsByDay(day)" :key="show.id" class="show-item">
              <span class="show-name">{{ show.show_name }}</span>
              <span class="show-channel">{{ show.channel_name }}</span>
              <span class="show-day">{{ show.available_on }}</span>
              <span class="show-air">{{ show.air_day || 'Not Specified' }}</span>
              <span class="show-time">{{ show.air_time || 'Not Specified' }}</span>
              <span class="show-number">{{ show.channel_number || 'Not Specified' }}</span>
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
  grid-template-columns: 1fr;
  color: var(--color-muted);
  font-style: italic;
}

.show-item {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.5rem;
  padding: 0.25rem 0;
}

.show-item span {
  overflow: hidden;
  text-overflow: ellipsis;
}

.show-item.header {
  font-weight: bold;
  border-bottom: 2px solid var(--color-muted); /* underline effect */
  padding-bottom: 0.25rem;
}

.show-list {
  margin-left: 1rem;
}

.day-title.empty {
  color: var(--color-muted);
  font-style: italic;
}
</style>
