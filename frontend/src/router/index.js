import { createRouter, createWebHistory } from 'vue-router'
import Register from '../components/register.vue'
import Login from '../components/Login.vue'
import Dashboard from '../components/dashboard.vue'
import { useAuthStore } from '../stores/auth'


const routes = [
  { path: '/', redirect:'/login' },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.token) {
    next('/login')
  }
  else if (to.name === 'Login' && auth.token) {
    next('/dashboard')
  }
  else if (to.name === 'Register' && auth.token) {
    next('/dashboard')
  }
  else {
    next()
  }
})

export default router
