import { defineStore } from 'pinia'
import { ref } from 'vue'
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { auth } from '@/firebase/config'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(true)

  // Initialize auth state listener
  const initAuth = () => {
    onAuthStateChanged(auth, (firebaseUser) => {
      user.value = firebaseUser
      loading.value = false
    })
  }

  // Sign up
  const signup = async (email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    return result.user
  }

  // Login
  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return result.user
  }

  // Logout
  const logout = async () => {
    await signOut(auth)
  }

  return {
    user,
    loading,
    initAuth,
    signup,
    login,
    logout
  }
})