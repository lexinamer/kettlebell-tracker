<template>
  <div class="edit-view template-edit-view">
    <div class="edit-content block-container">
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Template Name</label>
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

        <div class="form-actions">
          <button type="button" @click="handleCancel" class="btn secondary pill">
            Cancel
          </button>
          <button type="submit" class="btn primary pill">
            {{ editMode ? 'Update' : 'Save' }} Template
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Plus } from 'lucide-vue-next'
import { useTemplateStore } from '@/stores/templateStore'
import ExerciseBlock from '@/components/partials/ExerciseBlock.vue'

const route = useRoute()
const router = useRouter()
const templateStore = useTemplateStore()

const editMode = ref(false)
const typeOptions = ['EMOM', 'AMRAP', 'Sets']

const formData = ref({
  name: '',
  type: 'EMOM',
  rounds: 1,
  exercises: [{ name: '', reps: 1 }]
})

const addExercise = () => {
  formData.value.exercises.push({ name: '', reps: 1 })
}

const removeExercise = (index) => {
  formData.value.exercises.splice(index, 1)
}

const updateExercise = (index, updatedExercise) => {
  formData.value.exercises[index] = updatedExercise
}

const handleCancel = () => {
  router.push('/templates')
}

const handleSubmit = async () => {
  if (editMode.value && route.params.id) {
    await templateStore.updateTemplate(route.params.id, formData.value)
  } else {
    await templateStore.addTemplate(formData.value)
  }
  
  router.push('/templates')
}

onMounted(() => {
  // Check if editing existing template
  if (route.params.id) {
    editMode.value = true
    const template = templateStore.templates.find(t => t.id === route.params.id)
    
    if (template) {
      formData.value = { ...template }
    }
  }
})
</script>