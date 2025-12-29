<template>
  <div class="workouts main-content-wrapper">
    
    <div v-if="workoutStore.loading" class="loading">
      Loading workouts...
    </div>
    
    <div v-else-if="workoutStore.workouts.length === 0" class="empty empty-content">
      <p>No workouts yet. Create your first workout!</p>
      <button @click="router.push('/workouts/new')" class="btn primary pill">
        <Plus />
        <span>Log Workout</span>
      </button>
    </div>
    
    <div v-else class="workout-list">
      <WorkoutCard 
        v-for="workout in workoutStore.workouts" 
        :key="workout.id"
        :workout="workout"
        @edit="router.push(`/workouts/${workout.id}/edit`)"
        @duplicate="duplicateWorkout(workout)"
        @delete="confirmDelete(workout)"
      />
    </div>
    
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
import { useRouter } from 'vue-router'
import { Plus } from 'lucide-vue-next'
import { useWorkoutStore } from '@/stores/workoutStore'
import { useUserStore } from '@/stores/userStore'
import WorkoutCard from '@/components/cards/WorkoutCard.vue'
import ConfirmModal from '@/components/partials/ConfirmModal.vue'

const router = useRouter()
const workoutStore = useWorkoutStore()
const userStore = useUserStore()

const showDeleteModal = ref(false)
const workoutToDelete = ref(null)

const duplicateWorkout = (workout) => {
  // Store duplicate data in sessionStorage for the new page to pick up
  const duplicate = {
    workoutName: workout.workoutName ? `${workout.workoutName} (Copy)` : null,
    date: new Date().toISOString().split('T')[0],
    notes: workout.notes,
    blocks: JSON.parse(JSON.stringify(workout.blocks))
  }
  sessionStorage.setItem('duplicateWorkout', JSON.stringify(duplicate))
  router.push('/workouts/new')
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