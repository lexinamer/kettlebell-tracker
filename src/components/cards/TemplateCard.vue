<template>
  <div class="template-card" @click="$emit('edit')">
    <div class="card-content">
      <div class="card-header">
        <div class="card-title">
          <span class="name">{{ template.name }}</span>
        </div>
        
        <div class="card-actions">
          <button 
            type="button" 
            class="btn-icon tertiary icon-sm delete" 
            @click.stop="$emit('delete')"
            title="Delete"
          >
            <Trash2 />
          </button>
        </div>
      </div>
      
      <div class="card-details">
        {{ formatTemplate }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Trash2 } from 'lucide-vue-next'

const props = defineProps({
  template: {
    type: Object,
    required: true
  }
})

defineEmits(['edit', 'delete'])

const formatTemplate = computed(() => {
  const exercises = props.template.exercises.map(e => `${e.reps} ${e.name}`).join(' ')
  const rounds = props.template.rounds > 1 ? ` x ${props.template.rounds}` : ''
  return `${exercises}${rounds} ${props.template.type}`
})
</script>