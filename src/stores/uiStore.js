import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', () => {
  const showWorkoutModal = ref(false)
  const showTemplateModal = ref(false)
  
  const openWorkoutModal = () => {
    showWorkoutModal.value = true
  }
  
  const closeWorkoutModal = () => {
    showWorkoutModal.value = false
  }
  
  const openTemplateModal = () => {
    showTemplateModal.value = true
  }
  
  const closeTemplateModal = () => {
    showTemplateModal.value = false
  }
  
  return {
    showWorkoutModal,
    showTemplateModal,
    openWorkoutModal,
    closeWorkoutModal,
    openTemplateModal,
    closeTemplateModal
  }
})