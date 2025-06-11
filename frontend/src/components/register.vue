<template>
  <div class="flex min-h-screen bg-indigo-50">
    <!-- Side Panel -->
    <div class="hidden md:flex flex-col justify-center items-center w-1/2 bg-indigo-700 text-white p-12 rounded-r-3xl shadow-2xl">
      <h1 class="text-4xl font-extrabold mb-4 tracking-tight">¡Únete a nuestra tienda!</h1>
      <p class="text-lg mb-8 max-w-xs text-indigo-100">Crea tu cuenta para descubrir, comprar y vender productos increíbles. Gestiona tus artículos y aprovecha las mejores ofertas.</p>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48" class="w-32 h-32 opacity-90">
        <rect width="48" height="48" rx="12" fill="#fff" fill-opacity="0.1"/>
        <path d="M12 20h24l-2 16H14l-2-16zm2-4V8h20v8" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="18" cy="36" r="2" fill="#fff" fill-opacity="0.7"/>
        <circle cx="30" cy="36" r="2" fill="#fff" fill-opacity="0.7"/>
      </svg>
    </div>
    <!-- Register Form -->
    <div class="flex flex-1 justify-center items-center">
      <form @submit.prevent="register" class="bg-white shadow-2xl rounded-3xl px-12 py-10 w-full max-w-md flex flex-col gap-6">
        <h2 class="text-3xl font-bold text-center text-indigo-700 mb-2">Crear Cuenta</h2>
        <input
          v-model="email"
          type="email"
          placeholder="Correo electrónico"
          required
          class="px-5 py-3 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition text-gray-700 bg-white placeholder-indigo-300 text-lg"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Contraseña"
          required
          class="px-5 py-3 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition text-gray-700 bg-white placeholder-indigo-300 text-lg"
        />
        <button
          type="submit"
          class="bg-indigo-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-lg"
        >
          Registrarse
        </button>
        <p v-if="error" class="text-red-500 text-center text-base">{{ error }}</p>
        <p v-if="success" class="text-green-600 text-center text-base">{{ success }}</p>
        <p class="text-center text-base text-gray-600 mt-2">
          ¿Ya tienes una cuenta?
          <router-link to="/Login" class="text-indigo-600 hover:underline font-medium">Iniciar Sesión</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const error = ref('')
const success = ref('')

const router = useRouter()

const register = async () => {
  error.value = ''
  success.value = ''
  try {
    const res = await axios.post('http://localhost:4000/api/auth/register', {
      email: email.value,
      password: password.value
    })
    success.value = res.data.message
    email.value = ''
    password.value = ''
    router.push('/dashboard') // Redirect after successful registration
  } catch (err) {
    error.value = err.response?.data?.message || 'Error desconocido'
  }
}
</script>

<!-- Enhanced register.vue with a store/product themed side panel and larger, modern form. -->
