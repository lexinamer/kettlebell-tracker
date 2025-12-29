<template>
  <Transition name="drawer">
    <div v-if="isOpen" class="drawer-overlay" @click.self="$emit('close')">
      <div class="drawer">
        <div class="drawer-header">
          <h2>{{ title }}</h2>
          <button @click="$emit('close')" class="btn-icon tertiary icon-md">
            <X />
          </button>
        </div>
        
        <div class="drawer-body">
          <slot></slot>
        </div>
        
        <div class="drawer-footer">
          <slot name="footer">
            <button type="button" @click="$emit('close')" class="btn secondary pill">
              Cancel
            </button>
            <button type="submit" class="btn primary pill" @click="$emit('save')">
              Save
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
  }
})

defineEmits(['close', 'save'])
</script>