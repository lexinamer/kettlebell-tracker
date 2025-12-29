<template>
  <div class="template main-content-wrapper">
    
    <div v-if="templateStore.loading" class="loading">
      Loading templates...
    </div>
    
    <div v-else-if="templateStore.templates.length === 0" class="empty empty-content">
      <p>No templates yet. Create your first template!</p>
      <button @click="openDrawer" class="btn primary pill">
        <Plus />
        <span>Add Template</span>
      </button>
    </div>
    
    <div v-else class="template-list">
      <TemplateCard 
        v-for="template in templateStore.templates" 
        :key="template.id"
        :template="template"
        @edit="editTemplate(template)"
        @delete="confirmDelete(template)"
      />
    </div>
    
    <TemplateDrawer 
      :isOpen="showDrawer"
      :template="selectedTemplate"
      @close="closeDrawer"
      @save="handleSave"
    />
    
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
import { Plus } from 'lucide-vue-next'
import { useTemplateStore } from '@/stores/templateStore'
import TemplateCard from '@/components/cards/TemplateCard.vue'
import TemplateDrawer from '@/components/drawers/TemplateDrawer.vue'
import ConfirmModal from '@/components/partials/ConfirmModal.vue'

const templateStore = useTemplateStore()

const showDrawer = ref(false)
const selectedTemplate = ref(null)
const showDeleteModal = ref(false)
const templateToDelete = ref(null)

const openDrawer = () => {
  selectedTemplate.value = null
  showDrawer.value = true
}

const closeDrawer = () => {
  showDrawer.value = false
  selectedTemplate.value = null
}

const handleSave = async (templateData) => {
  if (selectedTemplate.value) {
    await templateStore.updateTemplate(selectedTemplate.value.id, templateData)
  } else {
    await templateStore.addTemplate(templateData)
  }
  closeDrawer()
}

const editTemplate = (template) => {
  selectedTemplate.value = template
  showDrawer.value = true
}

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