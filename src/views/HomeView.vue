<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/useUserStore'
import NavbarView from './NavbarView.vue'

const userStore = useUserStore()
</script>

<template>
  <main>
    <div class="navbar-container">
      <NavbarView />
      <h1>WatchPal</h1>
      <h2>Your watchlist companion</h2>
    </div>

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
          <label for="role-filter">Day of week:</label>
          <select v-model="selectedRoleFilter" id="role-filter" class="filter-select">
            <option value="all">All Types</option>
            <option value="Arc Reader">ARC Readers</option>
            <option value="Beta Reader">Beta Readers</option>
            <option value="Proof Reader">Proof Readers</option>
          </select>
        </div>

        <div class="filter-group">
          <label for="service-filter">Channel/Service:</label>
          <select v-model="selectedServiceFilter" id="service-filter" class="filter-select">
            <option value="all">All Readers</option>
            <option value="free">Free Readers</option>
            <option value="paid">Paid Readers</option>
          </select>
        </div>

        <div class="filter-group">
          <label for="genre-filter">Genre Type:</label>
          <select v-model="selectedGenreFilter" id="genre-filter" class="filter-select">
            <option value="all">All Genres</option>
            <option v-for="genre in availableGenres" :key="genre.id" :value="genre.id">
              {{ genre.name }}
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
          <li
            v-for="show in showsByDay(day)"
            :key="show.id"
            class="show-item"
          >
            <strong>{{ show.name }}</strong> — {{ show.channel }}
          </li>
        </ul>
      </div>
    </div>
  </main>
</template>

<style scoped>
/* Search and Filters */
.search-filters {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.search-bar {
  margin-bottom: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #007bff;
}

.filters {
  display: flex;
  gap: 1rem;
  align-items: end;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.filter-group label {
  font-weight: 600;
  color: #555;
  font-size: 0.9rem;
}

.filter-select {
  padding: 0.5rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  min-width: 150px;
}

.clear-filters-btn {
  padding: 0.5rem 1rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
}

.clear-filters-btn:hover {
  background: #545b62;
}
</style>
