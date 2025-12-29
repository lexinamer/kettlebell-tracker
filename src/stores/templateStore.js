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
  getDocs
} from 'firebase/firestore'
import { db } from '@/firebase/config'
import { useAuthStore } from './authStore'

export const useTemplateStore = defineStore('template', () => {
  const templates = ref([])
  const loading = ref(false)

  // Fetch templates for current user
  const fetchTemplates = async () => {
    const authStore = useAuthStore()
    if (!authStore.user) return

    loading.value = true
    try {
      const q = query(
        collection(db, 'templates'),
        where('userId', '==', authStore.user.uid)
      )
      const snapshot = await getDocs(q)
      templates.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      console.error('Error fetching templates:', error)
    } finally {
      loading.value = false
    }
  }

  // Add template
  const addTemplate = async (templateData) => {
    const authStore = useAuthStore()
    if (!authStore.user) return

    const template = {
      userId: authStore.user.uid,
      name: templateData.name,
      type: templateData.type,
      rounds: templateData.rounds,
      exercises: templateData.exercises
    }

    const docRef = await addDoc(collection(db, 'templates'), template)
    await fetchTemplates()
    return docRef.id
  }

  // Update template
  const updateTemplate = async (id, templateData) => {
    const templateRef = doc(db, 'templates', id)
    await updateDoc(templateRef, {
      name: templateData.name,
      type: templateData.type,
      rounds: templateData.rounds,
      exercises: templateData.exercises
    })
    await fetchTemplates()
  }

  // Delete template
  const deleteTemplate = async (id) => {
    await deleteDoc(doc(db, 'templates', id))
    await fetchTemplates()
  }

  return {
    templates,
    loading,
    fetchTemplates,
    addTemplate,
    updateTemplate,
    deleteTemplate
  }
})