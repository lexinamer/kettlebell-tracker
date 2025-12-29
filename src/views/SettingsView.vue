<template>
  <div class="settings main-content-wrapper">
    
    <div class="settings-content">
      <!-- Account Section -->
      <section class="settings-section">
        <h2>Account</h2>
        <p class="section-description">Manage your account settings and security</p>
        <div class="setting-item">
          <label>Email</label>
          <p class="readonly-value">{{ authStore.user?.email }}</p>
        </div>
        
        <div class="settings-account">
          <button @click="openChangePasswordModal" class="btn secondary pill">
            Change Password
          </button>
          <button @click="handlePasswordReset" class="btn secondary pill">
            Reset Password via Email
          </button>
          <button @click="handleLogout" class="btn secondary pill">
            Log Out
          </button>
        </div>
      </section>
      
      <!-- Weight Presets Section -->
      <section class="settings-section">
        <h2>Weight Presets</h2>
        <p class="section-description">Manage weight options and preferred units</p>
        
        <div class="form-group">
          <label>Units</label>
          <div class="segmented-control">
            <button 
              class="segment"
              :class="{ active: localSettings.units === 'kg' }"
              @click="toggleUnits('kg')"
            >
              kg
            </button>
            <button 
              class="segment"
              :class="{ active: localSettings.units === 'lbs' }"
              @click="toggleUnits('lbs')"
            >
              lbs
            </button>
          </div>
        </div>
        
        <div class="form-group">
          <label>Weights</label>
          <div class="preset-chips">
            <div 
              v-for="(weight, index) in localSettings.weightPresets" 
              :key="index" 
              class="chip preset-chip"
              :class="{ inactive: !weight.active }"
            >
              <span class="chip-value" @click="openEditWeightModal(weight, index)">
                {{ weight.value }}
              </span>
              <button 
                type="button"
                class="chip-toggle"
                @click.stop="toggleWeight(index)"
              >
                <Eye v-if="weight.active" :size="16" />
                <EyeOff v-else :size="16" />
              </button>
            </div>
            <button 
              type="button"
              class="chip subtle add-chip"
              @click="openAddWeightModal"
            >
              <span>Add</span>
            </button>
          </div>
        </div>
      </section>
      
      <!-- Exercise Presets Section -->
      <section class="settings-section">
        <h2>Exercise Presets</h2>
        <p class="section-description">Manage exercise options for quick logging</p>
        
        <div class="form-group">
          <label>Exercises</label>
          <div class="preset-chips">
            <div 
              v-for="(exercise, index) in localSettings.exercisePresets" 
              :key="index" 
              class="chip preset-chip"
              :class="{ inactive: !exercise.active }"
            >
              <span class="chip-value" @click="openEditExerciseModal(exercise, index)">
                {{ exercise.name }}
              </span>
              <button 
                type="button"
                class="chip-toggle"
                @click.stop="toggleExercise(index)"
              >
                <Eye v-if="exercise.active" :size="16" />
                <EyeOff v-else :size="16" />
              </button>
            </div>
            <button 
              type="button"
              class="chip subtle add-chip"
              @click="openAddExerciseModal"
            >
              <span>Add</span>
            </button>
          </div>
        </div>
      </section>
    </div>
    
    <!-- Change Password Modal -->
    <BaseModal
      :isOpen="showChangePasswordModal"
      title="Change Password"
      size="sm"
      :showDefaultFooter="false"
      @close="closeChangePasswordModal"
    >
      <div class="form-group">
        <label>Current Password</label>
        <input 
          v-model="passwordFormData.currentPassword" 
          type="password"
          required
        />
      </div>
      
      <div class="form-group">
        <label>New Password</label>
        <input 
          v-model="passwordFormData.newPassword" 
          type="password"
          required
        />
      </div>
      
      <div class="form-group">
        <label>Confirm New Password</label>
        <input 
          v-model="passwordFormData.confirmPassword" 
          type="password"
          required
        />
      </div>
      
      <template #footer>
        <button type="button" @click="closeChangePasswordModal" class="btn secondary pill">
          Cancel
        </button>
        <button type="button" @click="handleChangePassword" class="btn primary pill">
          Update Password
        </button>
      </template>
    </BaseModal>
    
    <!-- Weight Edit/Add Modal -->
    <BaseModal
      :isOpen="showWeightModal"
      :title="editingWeightIndex !== null ? 'Edit Weight' : 'Add Weight'"
      size="sm"
      :showDefaultFooter="false"
      @close="closeWeightModal"
    >
      <div class="form-group">
        <label>Value</label>
        <input 
          v-model.number="weightFormData.value" 
          type="number"
          inputmode="numeric"
          placeholder="24"
          required
        />
      </div>
      
      <template #footer>
        <button 
          v-if="editingWeightIndex !== null"
          type="button"
          @click="deleteWeight" 
          class="btn delete-btn pill"
        >
          Delete
        </button>
        <div style="flex: 1"></div>
        <button type="button" @click="closeWeightModal" class="btn secondary pill">
          Cancel
        </button>
        <button type="button" @click="saveWeight" class="btn primary pill">
          Save
        </button>
      </template>
    </BaseModal>
    
    <!-- Exercise Edit/Add Modal -->
    <BaseModal
      :isOpen="showExerciseModal"
      :title="editingExerciseIndex !== null ? 'Edit Exercise' : 'Add Exercise'"
      size="sm"
      :showDefaultFooter="false"
      @close="closeExerciseModal"
    >
      <div class="form-group">
        <label>Exercise Name</label>
        <input 
          v-model="exerciseFormData.name" 
          type="text"
          placeholder="Press"
          required
        />
      </div>
      
      <template #footer>
        <button 
          v-if="editingExerciseIndex !== null"
          type="button"
          @click="deleteExercise" 
          class="btn delete-btn pill"
        >
          Delete
        </button>
        <div style="flex: 1"></div>
        <button type="button" @click="closeExerciseModal" class="btn secondary pill">
          Cancel
        </button>
        <button type="button" @click="saveExercise" class="btn primary pill">
          Save
        </button>
      </template>
    </BaseModal>
    
    <!-- Confirm Delete Modals -->
    <ConfirmModal
      :isOpen="showDeleteWeightConfirm"
      title="Delete Weight"
      message="This weight preset will be permanently deleted."
      @close="showDeleteWeightConfirm = false"
      @confirm="confirmDeleteWeight"
    />
    
    <ConfirmModal
      :isOpen="showDeleteExerciseConfirm"
      title="Delete Exercise"
      message="This exercise preset will be permanently deleted."
      @close="showDeleteExerciseConfirm = false"
      @confirm="confirmDeleteExercise"
    />

    <!-- Password Reset Sent Modal -->
    <BaseModal
      :isOpen="showResetEmailSent"
      title="Reset Email Sent"
      size="sm"
      confirmText="Got it"
      cancelText=""
      :showDefaultFooter="true"
      @close="showResetEmailSent = false"
      @confirm="showResetEmailSent = false"
    >
      <p>A password reset email has been sent to <strong>{{ authStore.user?.email }}</strong>.</p>
      <p style="margin-top: var(--spacing-md);">Check your inbox and spam folder.</p>
      
      <template #footer>
        <button type="button" @click="showResetEmailSent = false" class="btn primary pill">
          Got it
        </button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { sendPasswordResetEmail, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import { Eye, EyeOff, Plus } from 'lucide-vue-next'
import { auth } from '@/firebase/config'
import { useAuthStore } from '@/stores/authStore'
import { useUserStore } from '@/stores/userStore'
import BaseModal from '@/components/partials/BaseModal.vue'
import ConfirmModal from '@/components/partials/ConfirmModal.vue'

const authStore = useAuthStore()
const userStore = useUserStore()
const router = useRouter()

const localSettings = ref({
  units: 'kg',
  weightPresets: [],
  exercisePresets: []
})

// Password Change Modal
const showChangePasswordModal = ref(false)
const showResetEmailSent = ref(false)
const passwordFormData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Weight Modal
const showWeightModal = ref(false)
const editingWeightIndex = ref(null)
const weightFormData = ref({ value: null, active: true })
const showDeleteWeightConfirm = ref(false)

// Exercise Modal
const showExerciseModal = ref(false)
const editingExerciseIndex = ref(null)
const exerciseFormData = ref({ name: '', active: true })
const showDeleteExerciseConfirm = ref(false)

onMounted(async () => {
  await userStore.fetchSettings()
  localSettings.value = JSON.parse(JSON.stringify(userStore.settings))
})

watch(() => userStore.settings, (newSettings) => {
  localSettings.value = JSON.parse(JSON.stringify(newSettings))
}, { deep: true })

const saveSettings = async () => {
  await userStore.updateSettings(localSettings.value)
}

const toggleUnits = (newUnit) => {
  if (newUnit === localSettings.value.units) return
  
  const oldUnit = localSettings.value.units
  localSettings.value.units = newUnit
  
  // Convert all weight values
  localSettings.value.weightPresets = localSettings.value.weightPresets.map(preset => {
    let newValue
    if (oldUnit === 'kg' && newUnit === 'lbs') {
      // kg to lbs
      newValue = Math.round(preset.value * 2.20462)
    } else if (oldUnit === 'lbs' && newUnit === 'kg') {
      // lbs to kg
      newValue = Math.round(preset.value / 2.20462)
    }
    return { ...preset, value: newValue }
  })
  
  // Sort by value after conversion
  localSettings.value.weightPresets.sort((a, b) => a.value - b.value)
  
  saveSettings()
}

// Password Functions
const openChangePasswordModal = () => {
  passwordFormData.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  showChangePasswordModal.value = true
}

const closeChangePasswordModal = () => {
  showChangePasswordModal.value = false
  passwordFormData.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
}

const handleChangePassword = async () => {
  if (passwordFormData.value.newPassword !== passwordFormData.value.confirmPassword) {
    alert('New passwords do not match')
    return
  }
  
  if (passwordFormData.value.newPassword.length < 6) {
    alert('Password must be at least 6 characters')
    return
  }
  
  try {
    const user = auth.currentUser
    
    // Reauthenticate first
    const credential = EmailAuthProvider.credential(
      user.email,
      passwordFormData.value.currentPassword
    )
    await reauthenticateWithCredential(user, credential)
    
    // Update password
    await updatePassword(user, passwordFormData.value.newPassword)
    
    alert('Password updated successfully!')
    closeChangePasswordModal()
  } catch (error) {
    if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
      alert('Current password is incorrect')
    } else {
      alert('Error updating password: ' + error.message)
    }
  }
}

const handlePasswordReset = async () => {
  try {
    await sendPasswordResetEmail(auth, authStore.user.email)
    showResetEmailSent.value = true
  } catch (error) {
    alert('Error sending reset email: ' + error.message)
  }
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

// Weight Functions
const toggleWeight = (index) => {
  localSettings.value.weightPresets[index].active = !localSettings.value.weightPresets[index].active
  saveSettings()
}

const openAddWeightModal = () => {
  editingWeightIndex.value = null
  weightFormData.value = { value: null, active: true }
  showWeightModal.value = true
}

const openEditWeightModal = (weight, index) => {
  editingWeightIndex.value = index
  weightFormData.value = { ...weight }
  showWeightModal.value = true
}

const closeWeightModal = () => {
  showWeightModal.value = false
  editingWeightIndex.value = null
  weightFormData.value = { value: null, active: true }
}

const saveWeight = () => {
  if (!weightFormData.value.value) return
  
  if (editingWeightIndex.value !== null) {
    localSettings.value.weightPresets[editingWeightIndex.value] = { ...weightFormData.value }
  } else {
    if (!localSettings.value.weightPresets.some(w => w.value === weightFormData.value.value)) {
      localSettings.value.weightPresets.push({ ...weightFormData.value })
      localSettings.value.weightPresets.sort((a, b) => a.value - b.value)
    }
  }
  
  saveSettings()
  closeWeightModal()
}

const deleteWeight = () => {
  showDeleteWeightConfirm.value = true
}

const confirmDeleteWeight = () => {
  localSettings.value.weightPresets.splice(editingWeightIndex.value, 1)
  saveSettings()
  showDeleteWeightConfirm.value = false
  closeWeightModal()
}

// Exercise Functions
const toggleExercise = (index) => {
  localSettings.value.exercisePresets[index].active = !localSettings.value.exercisePresets[index].active
  saveSettings()
}

const openAddExerciseModal = () => {
  editingExerciseIndex.value = null
  exerciseFormData.value = { name: '', active: true }
  showExerciseModal.value = true
}

const openEditExerciseModal = (exercise, index) => {
  editingExerciseIndex.value = index
  exerciseFormData.value = { ...exercise }
  showExerciseModal.value = true
}

const closeExerciseModal = () => {
  showExerciseModal.value = false
  editingExerciseIndex.value = null
  exerciseFormData.value = { name: '', active: true }
}

const saveExercise = () => {
  if (!exerciseFormData.value.name) return
  
  if (editingExerciseIndex.value !== null) {
    localSettings.value.exercisePresets[editingExerciseIndex.value] = { ...exerciseFormData.value }
  } else {
    if (!localSettings.value.exercisePresets.some(e => e.name === exerciseFormData.value.name)) {
      localSettings.value.exercisePresets.push({ ...exerciseFormData.value })
    }
  }
  
  saveSettings()
  closeExerciseModal()
}

const deleteExercise = () => {
  showDeleteExerciseConfirm.value = true
}

const confirmDeleteExercise = () => {
  localSettings.value.exercisePresets.splice(editingExerciseIndex.value, 1)
  saveSettings()
  showDeleteExerciseConfirm.value = false
  closeExerciseModal()
}
</script>