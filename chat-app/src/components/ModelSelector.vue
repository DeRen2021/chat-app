<script setup>
import { AVAILABLE_MODELS } from '../api/config'

defineProps({
  modelId: {
    type: String,
    required: true
  }
})

defineEmits(['update:modelId'])
</script>

<template>
  <div class="model-selector">
    <select 
      :value="modelId"
      @change="$emit('update:modelId', $event.target.value)"
      class="model-select"
    >
      <option 
        v-for="model in AVAILABLE_MODELS" 
        :key="model.id" 
        :value="model.id"
      >
        {{ model.name }} - {{ model.description }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.model-selector {
  margin-bottom: 1rem;
}

.model-select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
  outline: none;
}

.model-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
}
</style> 