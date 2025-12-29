import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/authStore'
import './assets/global.css'
import './assets/header.css'      
import './assets/components.css'  
import './assets/views.css'      
import './assets/drawers.css' 
import './assets/buttons.css'    
import './assets/cards.css'      

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize auth state listener
const authStore = useAuthStore()
await authStore.initAuth()

app.mount('#app')