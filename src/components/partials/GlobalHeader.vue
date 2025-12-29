<template>
  <header class="global-header">
    <button @click="drawerOpen = true" class="btn-icon tertiary icon-md">
      <Menu />
    </button>
    
    <h1 class="page-title">
      <component :is="pageIcon" :size="20" />
      <span>{{ pageTitle }}</span>
    </h1>
    
    <button v-if="actionButton" @click="handleAction" :class="actionButton.class">
      <component :is="actionButton.icon" />
      <span v-if="actionButton.label" class="action-label">{{ actionButton.label }}</span>
    </button>
  </header>
  
  <HamburgerDrawer :isOpen="drawerOpen" @close="drawerOpen = false" />
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Menu, Plus, WeightTilde, FileText, Settings } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/authStore'
import { useUiStore } from '@/stores/uiStore'
import HamburgerDrawer from '@/components/partials/HamburgerDrawer.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUiStore()
const drawerOpen = ref(false)

const pageTitle = computed(() => {
  if (route.path.includes('/template')) return 'Block Templates'
  if (route.path.includes('/settings')) return 'Settings'
  return 'Workouts'
})

const pageIcon = computed(() => {
  if (route.path.includes('/template')) return FileText
  if (route.path.includes('/settings')) return Settings
  return WeightTilde
})

const actionButton = computed(() => {
  if (route.path.includes('/settings')) return null
  
  if (route.path.includes('/template')) {
    return {
      label: '',
      icon: Plus,
      class: 'btn-icon primary round icon-md right-cta',
      action: 'template'
    }
  }
  
  if (route.path.includes('/workouts')) {
    return {
      label: '',
      icon: Plus,
      class: 'btn-icon primary round icon-md right-cta',
      action: 'workout'
    }
  }
  
  return null
})

const handleAction = async () => {
  if (actionButton.value.action === 'workout') {
    uiStore.openWorkoutModal()
  } else if (actionButton.value.action === 'template') {
    uiStore.openTemplateModal()
  }
}
</script>