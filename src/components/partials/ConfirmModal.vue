<template>
  <BaseModal
    :isOpen="isOpen"
    :title="title"
    size="sm"
    :confirmText="confirmText"
    :cancelText="cancelText"
    confirmClass="delete-btn"
    @close="$emit('close')"
    @confirm="$emit('confirm')"
  >
    <p>{{ message }}</p>
  </BaseModal>
</template>

<script setup>
import BaseModal from './BaseModal.vue'

defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: 'Confirm Delete'
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: 'Delete'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  }
})

defineEmits(['close', 'confirm'])
</script>