<template>
  <Transition name="drawer-left">
    <div v-if="isOpen" class="drawer-left-overlay" @click="$emit('close')">
      <div class="drawer-left" @click.stop>
        <div class="drawer-left-header">
          <div class="brand">
            <span>Bell Track</span>
          </div>
          <button @click="$emit('close')" class="btn-icon tertiary icon-sm">
            <X />
          </button>
        </div>
        
        <div class="drawer-body">
          <nav class="drawer-nav">
            <router-link to="/workouts" @click="$emit('close')" class="drawer-nav-item" active-class="active">
              <WeightTilde />
              <span>Workouts</span>
            </router-link>
            
            <router-link to="/template" @click="$emit('close')" class="drawer-nav-item" active-class="active">
              <FileText />
              <span>Block Templates</span>
            </router-link>
            
            <router-link to="/settings" @click="$emit('close')" class="drawer-nav-item" active-class="active">
              <Settings />
              <span>Settings</span>
            </router-link>
          </nav>

          <button @click="handleLogWorkout" class="drawer-nav-item primary drawer-btn">
            <Plus />
            <span>Log Workout</span>
          </button>
        </div>
        
        <div class="drawer-footer logout-btn">
          <button @click="handleLogout" class="btn tertiary pill drawer-btn">
            <LogOut />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { FileText, Settings, Plus, LogOut, X, WeightTilde } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/authStore'
import { useUiStore } from '@/stores/uiStore'

defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close'])
const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUiStore()

const handleLogWorkout = () => {
  uiStore.openWorkoutModal()
  emit('close')
}

const handleLogout = async () => {
  await authStore.logout()
  emit('close')
  router.push('/login')
}
</script>