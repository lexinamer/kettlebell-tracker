import { defineStore } from 'pinia'
import { ref } from 'vue'
import { 
  doc, 
  getDoc, 
  setDoc,
  collection,
  addDoc
} from 'firebase/firestore'
import { db } from '@/firebase/config'
import { useAuthStore } from './authStore'

export const useUserStore = defineStore('user', () => {
  const settings = ref({
    units: 'kg',
    weightPresets: [],
    exercisePresets: []
  })

  const fetchSettings = async () => {
    const authStore = useAuthStore()
    if (!authStore.user) return

    const settingsRef = doc(db, 'settings', authStore.user.uid)
    const settingsSnap = await getDoc(settingsRef)

    if (settingsSnap.exists()) {
      settings.value = settingsSnap.data()
    } else {
      // New user - create default settings
      const defaultSettings = {
        units: 'kg',
        weightPresets: [
          { value: 8, active: true },
          { value: 12, active: true },
          { value: 16, active: true },
          { value: 20, active: true },
          { value: 24, active: true },
        ],
        exercisePresets: [
          { name: 'Clean', active: true },
          { name: 'Press', active: true },
          { name: 'Squat', active: true },
          { name: 'Swing', active: true },
          { name: 'Row', active: true },
          { name: 'Snatch', active: true },
          { name: 'Get-Up', active: true },
          { name: 'Lunge', active: false },
          { name: 'RDL', active: false },
          { name: 'Carry', active: false }
        ]
      }
      
      await setDoc(settingsRef, defaultSettings)
      settings.value = defaultSettings
      
      // Create default templates
      await createDefaultTemplates(authStore.user.uid)
    }
  }

  const createDefaultTemplates = async (userId) => {
    const defaultTemplates = [
      {
        userId,
        name: 'Armor Building Complex (ABC)',
        type: 'EMOM',
        rounds: 10,
        exercises: [
          { name: 'Clean', reps: 2 },
          { name: 'Press', reps: 1 },
          { name: 'Press', reps: 3 }
        ]
      },
      {
        userId,
        name: 'Simple & Sinister (S&S)',
        type: 'Sets',
        rounds: 5,
        exercises: [
          { name: 'Swing', reps: 20 },   
          { name: 'Get-Up', reps: 2 }
        ]
      },
      {
        userId,
        name: 'Snatch Test',
        type: 'AMRAP',
        rounds: 1,
        exercises: [
          { name: 'Snatch', reps: 100 },

        ]
      }
    ]
    
    // Add each template to Firestore
    for (const template of defaultTemplates) {
      await addDoc(collection(db, 'templates'), template)
    }
  }

  const updateSettings = async (newSettings) => {
    const authStore = useAuthStore()
    if (!authStore.user) return

    const settingsRef = doc(db, 'settings', authStore.user.uid)
    await setDoc(settingsRef, newSettings)
    settings.value = newSettings
  }

  return {
    settings,
    fetchSettings,
    updateSettings
  }
})