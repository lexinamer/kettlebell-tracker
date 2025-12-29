<template>
  <div class="custom-select" ref="selectRef">
    <button 
      type="button"
      @click="isOpen = !isOpen" 
      class="select-trigger"
      :class="{ active: isOpen }"
    >
      <span>{{ displayValue }}</span>
      <ChevronDown :size="16" class="chevron" :class="{ rotated: isOpen }" />
    </button>
    
    <Transition name="dropdown">
      <div v-if="isOpen" class="select-dropdown">
        <button
          v-for="option in options"
          :key="option.value"
          type="button"
          class="select-option"
          :class="{ selected: option.value === modelValue }"
          @click="selectOption(option)"
        >
          {{ option.label }}
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

const props = defineProps({
  modelValue: [String, Number],
  options: {
    type: Array,
    required: true
  },
  placeholder: {
    type: String,
    default: 'Select...'
  }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const selectRef = ref(null)

const displayValue = computed(() => {
  const selected = props.options.find(opt => opt.value === props.modelValue)
  return selected ? selected.label : props.placeholder
})

const selectOption = (option) => {
  emit('update:modelValue', option.value)
  isOpen.value = false
}

const handleClickOutside = (event) => {
  if (selectRef.value && !selectRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>