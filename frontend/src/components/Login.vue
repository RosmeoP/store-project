<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <form @submit.prevent="login" class="bg-white p-8 rounded-xl shadow-lg w-full max-w-xs flex flex-col gap-4">
      <h2 class="text-2xl font-semibold text-center text-blue-700 mb-2">Iniciar Sesión</h2>
      <input v-model="email" type="email" placeholder="Correo electrónico" required
        class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
      <input v-model="password" type="password" placeholder="Contraseña" required
        class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
      <button type="submit"
        class="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 font-medium transition">Ingresar</button>
      <p v-if="error" class="text-red-500 text-center text-sm">{{ error }}</p>
      <p class="text-center text-sm mt-2">
        ¿No tienes cuenta?
        <router-link to="/register" class="text-blue-600 hover:text-blue-800 underline">Regístrate aquí</router-link>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const email = ref('')
const password = ref('')
const error = ref('')

const router = useRouter()
const auth = useAuthStore()

const login = async () => {
  error.value = ''
  try {
    const success = await auth.login(email.value, password.value)
    if (success) {
      router.push('/dashboard')
    }
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Error desconocido'
  }
}
</script>
