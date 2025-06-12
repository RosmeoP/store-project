<template>
  <div class="flex min-h-screen bg-indigo-50">
    <!-- Side Panel -->
    <div class="hidden md:flex flex-col justify-center items-center w-1/2 bg-indigo-700 text-white p-12 rounded-r-3xl shadow-2xl">
      <h1 class="text-4xl font-extrabold mb-4 tracking-tight">Bienvenido de nuevo</h1>
      <p class="text-lg mb-8 max-w-xs text-indigo-100">Accede a tu cuenta para gestionar tus productos y descubrir nuevas oportunidades.</p>
      <img src="/vite.svg" alt="Logo" class="w-32 h-32 opacity-90" />
    </div>
    <!-- Login Form -->
    <div class="flex flex-1 justify-center items-center">
      <form @submit.prevent="login" class="bg-white p-12 rounded-3xl shadow-2xl w-full max-w-md flex flex-col gap-6">
        <h2 class="text-3xl font-bold text-center text-indigo-700 mb-2">Iniciar Sesión</h2>
        <input v-model="email" type="email" placeholder="Correo electrónico" required
          class="border border-indigo-200 rounded-lg px-5 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-700 bg-white placeholder-indigo-300 text-lg" />
        <input v-model="password" type="password" placeholder="Contraseña" required
          class="border border-indigo-200 rounded-lg px-5 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-700 bg-white placeholder-indigo-300 text-lg" />
        <button type="submit"
          class="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-3 font-semibold text-lg shadow transition">Ingresar</button>
        <p v-if="error" class="text-red-500 text-center text-base">{{ error }}</p>
        <p class="text-center text-base mt-2 text-gray-600">
          ¿No tienes cuenta?
          <router-link to="/register" class="text-indigo-600 hover:underline font-medium">Regístrate aquí</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'

const email = ref('')
const password = ref('')
const error = ref('')

const router = useRouter()
const auth = useAuthStore()

const login = async () => {
  error.value = ''
  try {
    const res = await axios.post('http://localhost:4000/api/auth/login', {
      email: email.value,
      password: password.value
    })
    // Guardar usuario y token en el store
    auth.token = res.data.token
    auth.user = res.data.user
    localStorage.setItem('token', res.data.token)
    router.push('/dashboard')
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Error desconocido'
  }
}
</script>
