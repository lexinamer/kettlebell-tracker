import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import LoginView from '@/views/LoginView.vue'
import WorkoutsView from '@/views/WorkoutsView.vue'
import WorkoutEditView from '@/views/WorkoutEditView.vue'
import TemplatesView from '@/views/TemplatesView.vue'
import TemplateEditView from '@/views/TemplateEditView.vue'
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
      path: '/workouts/new',
      name: 'workout-new',
      component: WorkoutEditView,
      meta: { requiresAuth: true }
    },
    {
      path: '/workouts/:id/edit',
      name: 'workout-edit',
      component: WorkoutEditView,
      meta: { requiresAuth: true }
    },
    {
      path: '/templates',
      name: 'templates',
      component: TemplatesView,
      meta: { requiresAuth: true }
    },
    {
      path: '/templates/new',
      name: 'template-new',
      component: TemplateEditView,
      meta: { requiresAuth: true }
    },
    {
      path: '/templates/:id/edit',
      name: 'template-edit',
      component: TemplateEditView,
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