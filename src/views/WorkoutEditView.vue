<template>
  <div class="edit-view workout-edit-view">
    <div class="edit-content">
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Workout Name</label>
          <input 
            v-model="formData.workoutName" 
            type="text" 
            placeholder="Full Body Strength"
          />
        </div>
        
        <div class="form-group">
          <label>Date</label>
          <label class="date-display" for="date-input">
            <span class="date-text">{{ formattedDate }}</span>
            <Calendar :size="20" class="calendar-icon" />
          </label>
          <input 
            id="date-input"
            v-model="formData.date" 
            type="date"
            class="date-input-hidden"
          />
        </div>
        
        <div class="form-group">
          <label>Notes</label>
          <textarea 
            v-model="formData.notes" 
            placeholder="Felt strong with new weights."
            rows="3"
          />
        </div>
        
        <div class="blocks-section">
          <div 
            v-for="(block, blockIndex) in formData.blocks" 
            :key="blockIndex" 
            class="block-container"
          >

           <div class="block-header-wrapper" @click="toggleBlock(blockIndex)">
            <div class="block-header" @click="toggleBlock(blockIndex)">
              <div class="block-title">
                <ChevronDown 
                  :size="16" 
                  :stroke-width="2.5"
                  class="chevron" 
                  :class="{ collapsed: collapsedBlocks[blockIndex] }" 
                />
                <span class="block-number">Block {{ blockIndex + 1 }}</span>
              </div>

              <div class="block-dropdown" @click.stop>
                <CustomSelect
                  v-if="templateStore.templates.length > 0"
                  :modelValue="null"
                  :options="templateOptions"
                  placeholder="Use Template..."
                  @update:modelValue="loadFromTemplate(blockIndex, $event)"
                />
              </div>
            </div>

            <div class="block-actions" @click.stop>                
              <button 
                type="button" 
                @click="saveAsTemplate(blockIndex)" 
                class="btn-icon tertiary icon-sm"
                title="Save as Template"
              >
                <Bookmark />
              </button>
              
              <button 
                v-if="formData.blocks.length > 1"
                type="button" 
                @click="removeBlock(blockIndex)" 
                class="btn-icon tertiary icon-sm delete"
                title="Delete Block"
              >
                <Trash2 />
              </button>
            </div>
           </div>

            <div v-show="!collapsedBlocks[blockIndex]" class="block-content">
              <div class="form-group">
                <label>Type</label>
                <div class="chip-group">
                  <button
                    v-for="type in typeOptions"
                    :key="type"
                    type="button"
                    class="chip"
                    :class="{ active: block.type === type }"
                    @click="block.type = type"
                  >
                    {{ type }}
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label>Style</label>
                <div class="chip-group">
                  <button
                    v-for="style in styleOptions"
                    :key="style"
                    type="button"
                    class="chip"
                    :class="{ active: block.style === style }"
                    @click="block.style = style"
                  >
                    {{ style }}
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label>Weights ({{ userStore.settings.units }})</label>
                <div class="chip-group weights">
                  <button
                    v-for="preset in activeWeights"
                    :key="preset.value"
                    type="button"
                    class="chip"
                    :class="{ active: block.weights.includes(preset.value + userStore.settings.units) }"
                    @click="toggleWeight(blockIndex, preset.value + userStore.settings.units)"
                  >
                    {{ preset.value }}
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label>Rounds</label>
                <input 
                  v-model.number="block.rounds" 
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
                    v-for="(exercise, exIndex) in block.exercises"
                    :key="exIndex"
                    :exercise="exercise"
                    :canRemove="block.exercises.length > 1"
                    @update="updateExercise(blockIndex, exIndex, $event)"
                    @remove="removeExercise(blockIndex, exIndex)"
                  />
                </div>
                <button type="button" @click="addExercise(blockIndex)" class="btn secondary chip subtle full-width">
                  Add Exercise
                </button>
              </div>
            </div>
          </div>
          
          <button type="button" @click="addBlock" class="btn secondary pill full-width add-block">
            <Plus /> Add Block
          </button>
        </div>

        <div class="form-actions">
          <button type="button" @click="handleCancel" class="btn secondary pill">
            Cancel
          </button>
          <button type="submit" class="btn primary pill">
            {{ editMode ? 'Update' : 'Save' }} Workout
          </button>
        </div>
      </form>
    </div>
    
    <!-- Save as Template Modal -->
    <BaseModal
      :isOpen="showSaveTemplateModal"
      title="Save as Template"
      size="sm"
      :showDefaultFooter="false"
      @close="showSaveTemplateModal = false"
    >
      <div class="form-group">
        <label>Template Name</label>
        <input 
          v-model="templateName" 
          type="text"
          placeholder="Heavy Press & Clean"
          required
        />
      </div>
      
      <template #footer>
        <button type="button" @click="showSaveTemplateModal = false" class="btn secondary pill">
          Cancel
        </button>
        <button type="button" @click="confirmSaveTemplate" class="btn primary pill">
          Save
        </button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Calendar, Trash2, Plus, Bookmark, ChevronDown } from 'lucide-vue-next'
import { useUserStore } from '@/stores/userStore'
import { useTemplateStore } from '@/stores/templateStore'
import { useWorkoutStore } from '@/stores/workoutStore'
import BaseModal from '@/components/partials/BaseModal.vue'
import ExerciseBlock from '@/components/partials/ExerciseBlock.vue'
import CustomSelect from '@/components/partials/CustomSelect.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const templateStore = useTemplateStore()
const workoutStore = useWorkoutStore()

const editMode = ref(false)
const collapsedBlocks = ref({})
const showSaveTemplateModal = ref(false)
const saveTemplateBlockIndex = ref(null)
const templateName = ref('')

const typeOptions = ['EMOM', 'AMRAP', 'Sets']
const styleOptions = ['Single', 'Double', 'Two-handed']

const activeWeights = computed(() => 
  userStore.settings.weightPresets.filter(w => w.active)
)

const templateOptions = computed(() => 
  templateStore.templates.map(t => ({
    value: t.id,
    label: t.name
  }))
)

const getDefaultBlock = () => ({
  type: 'EMOM',
  style: 'Single',
  weights: [],
  rounds: 1,
  exercises: [{ name: '', reps: 1 }]
})

const formData = ref({
  workoutName: '',
  date: new Date().toISOString().split('T')[0],
  notes: '',
  blocks: [getDefaultBlock()]
})

const formattedDate = computed(() => {
  if (!formData.value.date) return 'Select date'
  const date = new Date(formData.value.date + 'T00:00:00')
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  })
})

const toggleBlock = (index) => {
  collapsedBlocks.value[index] = !collapsedBlocks.value[index]
}

const toggleWeight = (blockIndex, weight) => {
  const block = formData.value.blocks[blockIndex]
  const index = block.weights.indexOf(weight)
  
  if (index > -1) {
    block.weights.splice(index, 1)
  } else {
    if (block.weights.length < 2) {
      block.weights.push(weight)
    } else {
      block.weights[1] = weight
    }
  }
}

const loadFromTemplate = (blockIndex, templateId) => {
  if (!templateId) return
  
  const template = templateStore.templates.find(t => t.id === templateId)
  if (template) {
    formData.value.blocks[blockIndex] = {
      type: template.type,
      style: formData.value.blocks[blockIndex].style,
      weights: formData.value.blocks[blockIndex].weights,
      rounds: template.rounds,
      exercises: JSON.parse(JSON.stringify(template.exercises))
    }
  }
}

const saveAsTemplate = (blockIndex) => {
  saveTemplateBlockIndex.value = blockIndex
  templateName.value = ''
  showSaveTemplateModal.value = true
}

const confirmSaveTemplate = async () => {
  if (!templateName.value.trim()) return
  
  const block = formData.value.blocks[saveTemplateBlockIndex.value]
  const templateData = {
    name: templateName.value.trim(),
    type: block.type,
    rounds: block.rounds,
    exercises: JSON.parse(JSON.stringify(block.exercises))
  }
  
  await templateStore.addTemplate(templateData)
  showSaveTemplateModal.value = false
  templateName.value = ''
  alert('Template saved!')
}

const addBlock = () => {
  formData.value.blocks.push(getDefaultBlock())
}

const removeBlock = (index) => {
  formData.value.blocks.splice(index, 1)
  delete collapsedBlocks.value[index]
}

const addExercise = (blockIndex) => {
  formData.value.blocks[blockIndex].exercises.push({ name: '', reps: 1 })
}

const removeExercise = (blockIndex, exIndex) => {
  formData.value.blocks[blockIndex].exercises.splice(exIndex, 1)
}

const updateExercise = (blockIndex, exIndex, updatedExercise) => {
  formData.value.blocks[blockIndex].exercises[exIndex] = updatedExercise
}

const handleCancel = () => {
  router.push('/workouts')
}

const handleSubmit = async () => {
  const payload = {
    ...formData.value,
    date: new Date(formData.value.date)
  }
  
  if (editMode.value && route.params.id) {
    await workoutStore.updateWorkout(route.params.id, payload)
  } else {
    await workoutStore.addWorkout(payload)
  }
  
  router.push('/workouts')
}

onMounted(async () => {
  await templateStore.fetchTemplates()
  
  // Check if editing existing workout
  if (route.params.id) {
    editMode.value = true
    const workout = workoutStore.workouts.find(w => w.id === route.params.id)
    
    if (workout) {
      formData.value = {
        ...workout,
        date: workout.date?.toDate 
          ? workout.date.toDate().toISOString().split('T')[0]
          : workout.date,
        blocks: JSON.parse(JSON.stringify(workout.blocks))
      }
    }
  } else {
    // Check for duplicate workout data
    const duplicateData = sessionStorage.getItem('duplicateWorkout')
    if (duplicateData) {
      formData.value = JSON.parse(duplicateData)
      sessionStorage.removeItem('duplicateWorkout')
    }
  }
})
</script>