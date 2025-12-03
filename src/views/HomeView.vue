<script setup>
import { computed, ref } from 'vue'
import { useUserStore } from '@/stores/useUserStore'
import { streamingServices } from '@/constants/services'
import showModal from '@/components/showModal.vue'

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL
const userStore = useUserStore()
const searchQuery = ref('')
const selectedDayFilter = ref('all')
const selectedServiceFilter = ref('all')
const showColumnDropdown = ref(false)

const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedShow = ref(null)

function openEditShowModal(show) {
  selectedShow.value = show
  showEditModal.value = true
}

async function handleUpdateShow(updatedData) {
  const success = await userStore.updateShow(selectedShow.value.id, updatedData)
  if (success) {
    alert('Show updated successfully!')
    showEditModal.value = false
  } else {
    alert('Failed to update show.')
  }
}

const selectedDay = ref(null)

const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

const showsByDay = (day) => {
  return filteredShows.value.filter(
    (show) => (show.available_on || show.air_day)?.toLowerCase() === day.toLowerCase(),
  )
}

const openAddShowModal = (day) => {
  selectedDay.value = day.toLowerCase()
  showAddModal.value = true
}

function formatValue(col, value) {
  if (!value) return 'Not Specified'
  if (['available_on', 'air_day'].includes(col)) {
    return capitalize(value)
  }
  return value
}

function capitalize(value) {
  if (!value) return ''
  return value.charAt(0).toUpperCase() + value.slice(1)
}

const visibleColumns = ref([
  'show_name',
  'channel_name',
  'available_on',
  'air_day',
  'air_time',
  'channel_number',
])

const allColumns = [
  { key: 'show_name', label: 'Show' },
  { key: 'channel_name', label: 'Channel' },
  { key: 'available_on', label: 'Watch Day' },
  { key: 'air_day', label: 'Air Day' },
  { key: 'air_time', label: 'Air Time' },
  { key: 'channel_number', label: 'Channel #' },
]

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

const deleteShow = async (showId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/shows/${showId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${userStore.user?.token}`,
      },
    })

    if (response.ok) {
      userStore.removeShow(showId)
      alert('Show deleted successfully!')
    } else {
      const result = await response.json()
      const errorMessage =
        result.error || result.message || 'Deleting show failed. Please try again.'
      alert(errorMessage)
    }
  } catch (error) {
    console.error('Delete show error:', error)
    alert(`An error occurred deleting show: ${error.message}`)
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
      <h2>Your Ultimate Watchlist Companion</h2>
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

          <div class="filter-group">
            <label>Visible Columns:</label>
            <div class="dropdown">
              <button @click="showColumnDropdown = !showColumnDropdown" class="dropdown-btn">
                Choose Columns ▾
              </button>
              <div v-if="showColumnDropdown" class="dropdown-menu">
                <label v-for="col in allColumns" :key="col.key" class="dropdown-item">
                  <input type="checkbox" v-model="visibleColumns" :value="col.key" />
                  {{ col.label }}
                </label>
              </div>
            </div>
          </div>

          <button @click="clearFilters" class="clear-filters-btn">Clear Filters</button>
        </div>
      </div>

      <div class="days-column">
        <div v-for="day in daysOfWeek" :key="day" class="day-section">
          <h2 class="day-title" :class="{ empty: showsByDay(day).length === 0 }">
            {{ capitalize(day) }}
            <button @click="openAddShowModal(day)" class="add-show-btn">+</button>
          </h2>
          <ul class="show-list">
            <li v-if="showsByDay(day).length > 0" class="show-item header">
              <span v-for="col in visibleColumns" :key="col">
                {{ allColumns.find((c) => c.key === col).label }}
              </span>
              <span>Actions</span>
            </li>
            <li v-if="showsByDay(day).length === 0" class="show-item empty">
              No shows yet — add one!
            </li>
            <li v-for="show in showsByDay(day)" :key="show.id" class="show-item">
              <span v-for="col in visibleColumns" :key="col">
                {{ formatValue(col, show[col]) }}
              </span>
              <span class="show-actions">
                <button @click="openEditShowModal(show)" class="icon-btn">✏️</button>
                <button @click="deleteShow(show.id)" class="icon-btn">🗑️</button>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </main>
    <showModal
      v-if="showAddModal"
      mode="add"
      @close="showAddModal = false"
      @add-show="handleAddShow"
      :preselected-day="selectedDay"
    />

    <showModal
      v-if="showEditModal"
      mode="edit"
      :show="selectedShow"
      @close="showEditModal = false"
      @update-show="handleUpdateShow"
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
  grid-template-columns: repeat(6, 1fr) auto;
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

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-btn {
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--color-muted);
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  border: 1px solid var(--color-muted);
  border-radius: 4px;
  padding: 0.5rem;
  z-index: 10;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.25rem 0;
}
</style>
