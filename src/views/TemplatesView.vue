<template>
  <div class="template main-content-wrapper">
    
    <div v-if="templateStore.loading" class="loading">
      Loading templates...
    </div>
    
    <div v-else-if="templateStore.templates.length === 0" class="empty empty-content">
      <p>No templates yet. Create your first template!</p>
      <button @click="router.push('/templates/new')" class="btn primary pill">
        <Plus />
        <span>Add Template</span>
      </button>
    </div>
    
    <div v-else class="template-list">
      <TemplateCard 
        v-for="template in templateStore.templates" 
        :key="template.id"
        :template="template"
        @edit="router.push(`/templates/${template.id}/edit`)"
        @delete="confirmDelete(template)"
      />
    </div>
    
    <ConfirmModal
      :isOpen="showDeleteModal"
      title="Delete Template"
      message="This template will be permanently deleted."
      @close="showDeleteModal = false"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Plus } from 'lucide-vue-next'
import { useTemplateStore } from '@/stores/templateStore'
import TemplateCard from '@/components/cards/TemplateCard.vue'
import ConfirmModal from '@/components/partials/ConfirmModal.vue'

const router = useRouter()
const templateStore = useTemplateStore()

const showDeleteModal = ref(false)
const templateToDelete = ref(null)

const confirmDelete = (template) => {
  templateToDelete.value = template
  showDeleteModal.value = true
}

const handleDelete = async () => {
  if (templateToDelete.value) {
    await templateStore.deleteTemplate(templateToDelete.value.id)
    templateToDelete.value = null
    showDeleteModal.value = false
  }
}

onMounted(() => {
  templateStore.fetchTemplates()
})
</script>