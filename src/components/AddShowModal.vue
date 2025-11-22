<script setup>
import { ref } from 'vue'
import { streamingServices } from '@/constants/services.js'

const emit = defineEmits(['close', 'add-show'])

const showName = ref('')
const channelName = ref('')
const channelNumber = ref('')
const availableOn = ref('sunday') // default to Sunday

const daysOfWeek = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday'
]

const submitForm = () => {
  // Emit the new show data back to parent
  emit('add-show', {
    show_name: showName.value,
    channel_name: channelName.value,
    channel_number: channelNumber.value,
    available_on: availableOn.value
  })
  emit('close')
}
</script>

<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="add-show-form">
      <button class="close-btn" @click="$emit('close')">×</button>
      <h2>Add a Show</h2>

      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="showName">Show Name:</label>
          <input v-model="showName" id="showName" type="text" required />
        </div>

        <div class="form-group">
          <label for="channelName">Channel Name:</label>
          <select v-model="channelName" id="channelName" required>
            <option disabled value="">Select a channel</option>
            <option v-for="service in streamingServices" :key="service.id" :value="service.name">
              {{ service.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label for="channelNumber">Channel Number:</label>
          <input v-model="channelNumber" id="channelNumber" type="text" placeholder="Optional" />
        </div>

        <div class="form-group">
          <label for="availableOn">Available On:</label>
          <select v-model="availableOn" id="availableOn">
            <option v-for="day in daysOfWeek" :key="day" :value="day">
              {{ day.charAt(0).toUpperCase() + day.slice(1) }}
            </option>
          </select>
        </div>

        <button type="submit" class="submit-btn">Add Show</button>
      </form>
    </div>
  </div>
</template>
