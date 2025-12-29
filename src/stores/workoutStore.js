import { defineStore } from 'pinia'
import { ref } from 'vue'
import { 
  collection, 
  addDoc, 
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp
} from 'firebase/firestore'
import { db } from '@/firebase/config'
import { useAuthStore } from './authStore'

export const useWorkoutStore = defineStore('workout', () => {
  const workouts = ref([])
  const loading = ref(false)

  // Fetch workouts for current user
  const fetchWorkouts = async () => {
    const authStore = useAuthStore()
    if (!authStore.user) return

    loading.value = true
    try {
      const q = query(
        collection(db, 'workouts'),
        where('userId', '==', authStore.user.uid),
        orderBy('date', 'desc')
      )
      const snapshot = await getDocs(q)
      workouts.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      console.error('Error fetching workouts:', error)
    } finally {
      loading.value = false
    }
  }

  // Add workout
  const addWorkout = async (workoutData) => {
    const authStore = useAuthStore()
    if (!authStore.user) return

    const workout = {
      userId: authStore.user.uid,
      date: Timestamp.fromDate(workoutData.date),
      workoutName: workoutData.workoutName || null,
      notes: workoutData.notes || null,
      blocks: workoutData.blocks
    }

    const docRef = await addDoc(collection(db, 'workouts'), workout)
    await fetchWorkouts() // Refresh list
    return docRef.id
  }

  // Update workout
  const updateWorkout = async (id, workoutData) => {
    const workoutRef = doc(db, 'workouts', id)
    await updateDoc(workoutRef, {
      date: Timestamp.fromDate(workoutData.date),
      workoutName: workoutData.workoutName || null,
      notes: workoutData.notes || null,
      blocks: workoutData.blocks
    })
    await fetchWorkouts() // Refresh list
  }

  // Delete workout
  const deleteWorkout = async (id) => {
    await deleteDoc(doc(db, 'workouts', id))
    await fetchWorkouts() // Refresh list
  }

  return {
    workouts,
    loading,
    fetchWorkouts,
    addWorkout,
    updateWorkout,
    deleteWorkout
  }
})