<template>
  <BaseDrawer 
    :isOpen="isOpen" 
    :title="editMode ? 'Edit Block' : 'New Block'"
    @close="$emit('close')"
    @save="handleSubmit"
  >
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Block Name</label>
        <input 
          v-model="formData.name" 
          type="text" 
          placeholder="Heavy Press & Clean"
          required
        />
      </div>
      
      <div class="form-group">
        <label>Type</label>
        <div class="chip-group">
          <button
            v-for="type in typeOptions"
            :key="type"
            type="button"
            class="chip"
            :class="{ active: formData.type === type }"
            @click="formData.type = type"
          >
            {{ type }}
          </button>
        </div>
      </div>
      
      <div class="form-group">
        <label>Rounds</label>
        <input 
          v-model.number="formData.rounds" 
          type="number" 
          min="1"
          inputmode="numeric"
          class="rounds-input"
          @focus="$event.target.select()"
        />
      </div>
      
      <div class="form-group">
        <label>Exercises</label>
        <div class="exercises-list">
          <ExerciseBlock
            v-for="(exercise, index) in formData.exercises"
            :key="index"
            :exercise="exercise"
            :canRemove="formData.exercises.length > 1"
            @update="updateExercise(index, $event)"
            @remove="removeExercise(index)"
          />
        </div>
        <button type="button" @click="addExercise" class="btn secondary chip subtle full-width">
          Add Exercise
        </button>
      </div>
    </form>
  </BaseDrawer>
</template>

<script setup>
import { ref, watch } from 'vue'
import { Plus } from 'lucide-vue-next'
import BaseDrawer from '@/components/partials/BaseDrawer.vue'
import ExerciseBlock from '@/components/partials/ExerciseBlock.vue'

const props = defineProps({
  isOpen: Boolean,
  block: Object
})

const emit = defineEmits(['close', 'save'])

const editMode = ref(false)
const typeOptions = ['EMOM', 'AMRAP', 'Sets']

const formData = ref({
  name: '',
  type: 'EMOM',
  rounds: 1,
  exercises: [{ name: '', reps: 1 }]
})

watch(() => props.block, (newBlock) => {
  if (newBlock) {
    editMode.value = true
    formData.value = { ...newBlock }
  } else {
    editMode.value = false
    formData.value = {
      name: '',
      type: 'EMOM',
      rounds: 1,
      exercises: [{ name: '', reps: 1 }]
    }
  }
}, { immediate: true })

const addExercise = () => {
  formData.value.exercises.push({ name: '', reps: 1 })
}

const removeExercise = (index) => {
  formData.value.exercises.splice(index, 1)
}

const updateExercise = (index, updatedExercise) => {
  formData.value.exercises[index] = updatedExercise
}

const handleSubmit = () => {
  emit('save', formData.value)
}
</script>