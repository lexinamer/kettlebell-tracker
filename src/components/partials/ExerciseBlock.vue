<template>
  <div class="exercise-row">
    <CustomSelect
      :modelValue="localExercise.name"
      :options="exerciseOptions"
      placeholder="Select exercise"
      @update:modelValue="updateExerciseName"
    />
    
    <input 
      v-model.number="localExercise.reps" 
      type="number" 
      min="1"
      inputmode="numeric"
      placeholder="Reps"
      class="reps-input"
      @focus="$event.target.select()"
    />
    
    <button 
      type="button" 
      @click="$emit('remove')" 
      class="btn-icon tertiary icon-sm delete"
      :disabled="!canRemove"
    >
      <X :size="16" />
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { X } from 'lucide-vue-next'
import { useUserStore } from '@/stores/userStore'
import CustomSelect from '@/components/partials/CustomSelect.vue'

const props = defineProps({
  exercise: {
    type: Object,
    required: true
  },
  canRemove: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update', 'remove'])

const userStore = useUserStore()

const activeExercises = computed(() => 
  userStore.settings.exercisePresets.filter(e => e.active)
)

const exerciseOptions = computed(() => 
  activeExercises.value.map(e => ({
    value: e.name,
    label: e.name
  }))
)

const localExercise = computed({
  get: () => props.exercise,
  set: (value) => emit('update', value)
})

const updateExerciseName = (name) => {
  emit('update', { ...props.exercise, name })
}
</script>