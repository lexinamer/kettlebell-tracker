<template>
  <header class="global-header">
    <button @click="drawerOpen = true" class="btn-icon tertiary icon-md menu-trigger">
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
import { Menu, Plus, Activity, FileText, Settings, X } from 'lucide-vue-next'
import HamburgerDrawer from '@/components/partials/HamburgerDrawer.vue'

const route = useRoute()
const router = useRouter()
const drawerOpen = ref(false)

const pageTitle = computed(() => {
  if (route.path.includes('/templates')) {
    if (route.path.includes('/new')) return 'New Template'
    if (route.path.includes('/edit')) return 'Edit Template'
    return 'Block Templates'
  }
  if (route.path.includes('/workouts')) {
    if (route.path.includes('/new')) return 'New Workout'
    if (route.path.includes('/edit')) return 'Edit Workout'
    return 'Workouts'
  }
  if (route.path.includes('/settings')) return 'Settings'
  return 'Workouts'
})

const pageIcon = computed(() => {
  if (route.path.includes('/templates')) return FileText
  if (route.path.includes('/settings')) return Settings
  return Activity
})

const actionButton = computed(() => {
  // Show X button on edit/new pages
  if (route.path.includes('/new') || route.path.includes('/edit')) {
    return {
      label: '',
      icon: X,
      class: 'btn-icon tertiary icon-md right-cta',
      action: 'close'
    }
  }
  
  // No action button on settings
  if (route.path.includes('/settings')) {
    return null
  }
  
  if (route.path.includes('/templates')) {
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

const handleAction = () => {
  if (actionButton.value.action === 'workout') {
    router.push('/workouts/new')
  } else if (actionButton.value.action === 'template') {
    router.push('/templates/new')
  } else if (actionButton.value.action === 'close') {
    router.back()
  }
}
</script>