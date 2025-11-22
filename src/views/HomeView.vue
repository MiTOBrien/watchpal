<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/useUserStore'
import NavbarView from './NavbarView.vue'
import FooterView from './FooterView.vue'
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
            <label for="role-filter">Day of week:</label>
            <select v-model="selectedRoleFilter" id="role-filter" class="filter-select">
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
              <option value="amazon">Amazon Prime Video</option>
              <option value="apple">Apple TV</option>
              <option value="britbox">BritBox</option>
              <option value="disney+">Disney+</option>
              <option value="discovery+">Discovery+</option>
              <option value="hulu">Hulu</option>
              <option value="max">Max</option>
              <option value="netflix">Netflix</option>
              <option value="peacock">Peacock</option>
              <option value="paramount+">Paramount+</option>
              <option value="philo">Philo</option>
              <option value="roku">Roku</option>
              <option value="sling">Sling TV</option>
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
