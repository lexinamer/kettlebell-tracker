<template>
  <div v-if="authStore.loading">
    <p>Loading...</p>
  </div>
  <div v-else>
    <GlobalHeader v-if="authStore.user" />
    <router-view />
    
    <WorkoutDrawer 
      v-if="authStore.user"
      :isOpen="uiStore.showWorkoutModal"
      :workout="null"
      @close="uiStore.closeWorkoutModal"
      @save="handleWorkoutSave"
    />
    
    <TemplateDrawer
      v-if="authStore.user"
      :isOpen="uiStore.showTemplateModal"
      :block="null"
      @close="uiStore.closeTemplateModal"
      @save="handleTemplateSave"
    />
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'
import { useUiStore } from '@/stores/uiStore'
import { useWorkoutStore } from '@/stores/workoutStore'
import { useTemplateStore } from '@/stores/templateStore'
import GlobalHeader from '@/components/partials/GlobalHeader.vue'
import WorkoutDrawer from '@/components/drawers/WorkoutDrawer.vue'
import TemplateDrawer from '@/components/drawers/TemplateDrawer.vue'

const authStore = useAuthStore()
const uiStore = useUiStore()
const workoutStore = useWorkoutStore()
const templateStore = useTemplateStore()

const handleWorkoutSave = async (workoutData) => {
  const payload = {
    ...workoutData,
    date: new Date(workoutData.date)
  }
  await workoutStore.addWorkout(payload)
  uiStore.closeWorkoutModal()
}

const handleTemplateSave = async (blockData) => {
  await templateStore.addBlock(blockData)
  uiStore.closeTemplateModal()
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
</style>