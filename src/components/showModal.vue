<script setup>
import { ref, watch } from 'vue'
import { streamingServices } from '@/constants/services'

const props = defineProps({
  mode: { type: String, default: 'add' }, // "add" or "edit"
  show: { type: Object, default: null }, // existing show for edit
  preselectedDay: { type: String, default: null },
})

const emit = defineEmits(['close', 'add-show', 'update-show'])

const form = ref({
  show_name: '',
  channel_name: '',
  channel_number: '',
  available_on: props.preselectedDay || '',
  air_day: '',
  air_time: '',
})

// Pre-fill form when editing
watch(
  () => props.show,
  (newShow) => {
    if (props.mode === 'edit' && newShow) {
      form.value = { ...newShow }
    }
  },
  { immediate: true },
)

function handleSubmit() {
  if (props.mode === 'add') {
    emit('add-show', form.value)
  } else {
    emit('update-show', form.value)
  }
}
</script>

<template>
  <div class="modal-overlay">
    <div class="add-show-form">
      <button class="close-btn" @click="emit('close')">×</button>
      <h2>{{ mode === 'add' ? 'Add Show' : 'Edit Show' }}</h2>

      <div class="form-group">
        <label class="modal-text">Show Name</label>
        <input v-model="form.show_name" />
      </div>

      <div class="form-group">
        <label class="modal-text">Channel/Service</label>
        <select v-model="form.channel_name">
          <option value="">Select Channel</option>
          <option v-for="service in streamingServices" :key="service.id" :value="service.name">
            {{ service.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label class="modal-text">Channel Number</label>
        <input v-model="form.channel_number" />
      </div>

      <div class="form-group">
        <label class="modal-text">Available Day</label>
        <select v-model="form.available_on">
          <option value="">Select Day</option>
          <option value="sunday">Sunday</option>
          <option value="monday">Monday</option>
          <option value="tuesday">Tuesday</option>
          <option value="wednesday">Wednesday</option>
          <option value="thursday">Thursday</option>
          <option value="friday">Friday</option>
          <option value="saturday">Saturday</option>
        </select>
      </div>

      <div class="form-group">
        <label class="modal-text">Air Day</label>
        <select v-model="form.air_day">
          <option value="">Select Day</option>
          <option value="sunday">Sunday</option>
          <option value="monday">Monday</option>
          <option value="tuesday">Tuesday</option>
          <option value="wednesday">Wednesday</option>
          <option value="thursday">Thursday</option>
          <option value="friday">Friday</option>
          <option value="saturday">Saturday</option>
        </select>
      </div>

      <div class="form-group">
        <label class="modal-text">Air Time</label>
        <input v-model="form.air_time" type="time" />
      </div>

      <button class="submit-btn" @click="handleSubmit">
        {{ mode === 'add' ? 'Add' : 'Update' }}
      </button>
    </div>
  </div>
</template>
