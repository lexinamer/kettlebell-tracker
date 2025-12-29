<template>
  <div class="workouts main-content-wrapper">
    
    <div v-if="workoutStore.loading" class="loading">
      Loading workouts...
    </div>
    
    <div v-else-if="workoutStore.workouts.length === 0" class="empty empty-content">
      <p>No workouts yet. Track your first workout!</p>
      <button @click="openDrawer" class="btn primary pill">
        <Plus />
        <span>Log Workout</span>
      </button>
    </div>
    
    <div v-else class="workout-list">
      <WorkoutCard 
        v-for="workout in workoutStore.workouts" 
        :key="workout.id"
        :workout="workout"
        @edit="editWorkout(workout)"
        @duplicate="duplicateWorkout(workout)"
        @delete="confirmDelete(workout)"
      />
    </div>
    
    <WorkoutDrawer 
      :isOpen="showDrawer"
      :workout="selectedWorkout"
      @close="closeDrawer"
      @save="handleSave"
    />
    
    <ConfirmModal
      :isOpen="showDeleteModal"
      title="Delete Workout"
      message="This workout will be permanently deleted."
      @close="showDeleteModal = false"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Plus } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/authStore'
import { useWorkoutStore } from '@/stores/workoutStore'
import { useUserStore } from '@/stores/userStore'
import WorkoutCard from '@/components/cards/WorkoutCard.vue'
import WorkoutDrawer from '@/components/drawers/WorkoutDrawer.vue'
import ConfirmModal from '@/components/partials/ConfirmModal.vue'

const authStore = useAuthStore()
const workoutStore = useWorkoutStore()
const userStore = useUserStore()

const showDrawer = ref(false)
const selectedWorkout = ref(null)
const showDeleteModal = ref(false)
const workoutToDelete = ref(null)

const openDrawer = () => {
  selectedWorkout.value = null
  showDrawer.value = true
}

const closeDrawer = () => {
  showDrawer.value = false
  selectedWorkout.value = null
}

const handleSave = async (workoutData) => {
  const payload = {
    ...workoutData,
    date: new Date(workoutData.date)
  }
  
  if (selectedWorkout.value) {
    await workoutStore.updateWorkout(selectedWorkout.value.id, payload)
  } else {
    await workoutStore.addWorkout(payload)
  }
  
  closeDrawer()
}

const editWorkout = (workout) => {
  selectedWorkout.value = workout
  showDrawer.value = true
}

const duplicateWorkout = (workout) => {
  const duplicate = {
    workoutName: workout.workoutName ? `${workout.workoutName} (Copy)` : null,
    date: new Date().toISOString().split('T')[0],
    notes: workout.notes,
    blocks: JSON.parse(JSON.stringify(workout.blocks))
  }
  selectedWorkout.value = duplicate
  showDrawer.value = true
}

const confirmDelete = (workout) => {
  workoutToDelete.value = workout
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (workoutToDelete.value) {
    await workoutStore.deleteWorkout(workoutToDelete.value.id)
    workoutToDelete.value = null
    showDeleteModal.value = false
  }
}

onMounted(async () => {
  await userStore.fetchSettings()
  workoutStore.fetchWorkouts()
})
</script>