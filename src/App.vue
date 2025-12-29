<template>
  <div v-if="authStore.loading" class="loading-screen">
    <p>Loading...</p>
  </div>
  <template v-else>
    <GlobalHeader v-if="authStore.user" />
    <router-view />
  </template>
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

html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.loading-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
</style>