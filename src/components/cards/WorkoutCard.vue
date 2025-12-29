<template>
  <div class="workout-card" @click="$emit('edit')">
    <div class="card-content">
      <div class="card-header">
        <div class="card-title">
          <span class="date">{{ formattedDate }}</span>
          <span v-if="workout.workoutName" class="name"> • {{ workout.workoutName }}</span>
        </div>
        
        <div class="card-actions">
          <button 
            type="button" 
            class="btn-icon tertiary icon-sm duplicate" 
            @click.stop="$emit('duplicate')"
            title="Duplicate"
          >
            <Copy />
          </button>

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
      
      <p v-if="workout.notes" class="card-notes">{{ workout.notes }}</p>
      
      <div class="card-blocks">
        <div v-for="(block, index) in workout.blocks" :key="index" class="block">
          <div class="block-exercises">{{ formatExercises(block) }}</div>
          <div class="block-details">{{ formatDetails(block) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Copy, Trash2 } from 'lucide-vue-next'

const props = defineProps({
  workout: {
    type: Object,
    required: true
  }
})

defineEmits(['edit', 'duplicate', 'delete'])

const formattedDate = computed(() => {
  const date = props.workout.date.toDate()
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  })
})

const formatExercises = (block) => {
  const exercises = block.exercises.map(e => `${e.reps} ${e.name}`).join(' ')
  const rounds = block.rounds > 1 ? ` x ${block.rounds}` : ''
  return `${exercises}${rounds} ${block.type}`
}

const formatDetails = (block) => {
  const weights = block.weights.join('/')
  return `${block.style} ${weights}`
}
</script>