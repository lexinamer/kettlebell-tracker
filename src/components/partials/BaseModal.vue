<template>
  <Transition name="modal">
    <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-dialog" :class="size">
        <div class="modal-header">
          <h3>{{ title }}</h3>
          <button @click="$emit('close')" class="btn-icon tertiary icon-sm">
            <X />
          </button>
        </div>
        
        <div class="modal-body">
          <slot></slot>
        </div>
        
        <div class="modal-footer" v-if="$slots.footer || showDefaultFooter">
          <slot name="footer">
            <button type="button" @click="$emit('close')" class="btn secondary pill">
              {{ cancelText }}
            </button>
            <button type="button" @click="$emit('confirm')" class="btn primary pill" :class="confirmClass">
              {{ confirmText }}
            </button>
          </slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { X } from 'lucide-vue-next'

defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  size: {
    type: String,
    default: 'sm', // sm, md, lg
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  showDefaultFooter: {
    type: Boolean,
    default: true
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  confirmClass: {
    type: String,
    default: ''
  }
})

defineEmits(['close', 'confirm'])
</script>