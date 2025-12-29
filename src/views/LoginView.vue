<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Bell Track</h1>
      
      <form @submit.prevent="handleSubmit">
        <input 
          v-model="email" 
          type="email" 
          placeholder="Email" 
          required 
        />
        
        <input 
          v-model="password" 
          type="password" 
          placeholder="Password" 
          required 
        />
        
        <button type="submit">
          {{ isSignup ? 'Sign Up' : 'Log In' }}
        </button>
        
        <p v-if="error" class="error">{{ error }}</p>
      </form>
      
      <button @click="isSignup = !isSignup" class="toggle">
        {{ isSignup ? 'Already have an account? Log in' : 'Need an account? Sign up' }}
      </button>
      
      <button v-if="!isSignup" @click="showForgotPassword = true" class="forgot-password">
        Forgot password?
      </button>
    </div>
    
    <!-- Forgot Password Modal -->
    <BaseModal
      :isOpen="showForgotPassword"
      title="Reset Password"
      size="sm"
      :showDefaultFooter="false"
      @close="closeForgotPassword"
    >
      <p style="margin-bottom: var(--spacing-lg); color: var(--color-text-secondary);">
        Enter your email address and we'll send you a password reset link.
      </p>
      
      <div class="form-group">
        <label>Email</label>
        <input 
          v-model="resetEmail" 
          type="email"
          placeholder="your@email.com"
          required
        />
      </div>
      
      <template #footer>
        <button type="button" @click="closeForgotPassword" class="btn secondary pill">
          Cancel
        </button>
        <button type="button" @click="handlePasswordReset" class="btn primary pill">
          Send Reset Link
        </button>
      </template>
    </BaseModal>
    
    <!-- Reset Email Sent Modal -->
    <BaseModal
      :isOpen="showResetEmailSent"
      title="Reset Email Sent"
      size="sm"
      :showDefaultFooter="false"
      @close="showResetEmailSent = false"
    >
      <p>A password reset email has been sent to <strong>{{ resetEmail }}</strong>.</p>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/firebase/config'
import { useAuthStore } from '@/stores/authStore'
import BaseModal from '@/components/partials/BaseModal.vue'

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const isSignup = ref(false)
const error = ref('')

const showForgotPassword = ref(false)
const resetEmail = ref('')
const showResetEmailSent = ref(false)

const handleSubmit = async () => {
  error.value = ''
  try {
    if (isSignup.value) {
      await authStore.signup(email.value, password.value)
    } else {
      await authStore.login(email.value, password.value)
    }
    router.push('/workouts')
  } catch (err) {
    error.value = err.message
  }
}

const closeForgotPassword = () => {
  showForgotPassword.value = false
  resetEmail.value = ''
}

const handlePasswordReset = async () => {
  if (!resetEmail.value) return
  
  try {
    await sendPasswordResetEmail(auth, resetEmail.value)
    showForgotPassword.value = false
    showResetEmailSent.value = true
  } catch (error) {
    alert('Error sending reset email: ' + error.message)
  }
}
</script>