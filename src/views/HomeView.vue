<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/useUserStore'
import { streamingServices } from '@/constants/services'
import AddShowModal from '@/components/AddShowModal.vue'

const showAddModal = ref(false)

const handleAddShow = (newShow) => {
  // Save to store or backend
  console.log('New show added:', newShow)
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
          <h2 class="day-title">{{ day }}</h2>
          <ul class="show-list">
            <li v-for="show in showsByDay(day)" :key="show.id" class="show-item">
              <strong>{{ show.name }}</strong> — {{ show.channel }}
            </li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped></style>
