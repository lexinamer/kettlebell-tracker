import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import LoginView from '@/views/LoginView.vue'
import WorkoutsView from '@/views/WorkoutsView.vue'
import TemplateView from '@/views/TemplateView.vue'
import SettingsView from '@/views/SettingsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/workouts'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: true }
    },
    {
      path: '/workouts',
      name: 'workouts',
      component: WorkoutsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/template',
      name: 'template',
      component: TemplateView,
      meta: { requiresAuth: true }
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
      meta: { requiresAuth: true }
    }
  ]
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Wait for auth to initialize
  if (authStore.loading) {
    const unwatch = authStore.$subscribe(() => {
      if (!authStore.loading) {
        unwatch()
        checkAuth()
      }
    })
  } else {
    checkAuth()
  }
  
  function checkAuth() {
    if (to.meta.requiresAuth && !authStore.user) {
      next('/login')
    } else if (to.meta.requiresGuest && authStore.user) {
      next('/workouts')
    } else {
      next()
    }
  }
})

export default router