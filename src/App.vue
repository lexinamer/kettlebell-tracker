<template>
  <div v-if="authStore.loading">
    <p>Loading...</p>
  </div>
  <div v-else>
    <GlobalHeader v-if="authStore.user" />
    <router-view />
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'
import GlobalHeader from '@/components/partials/GlobalHeader.vue'

const authStore = useAuthStore()
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
</style>