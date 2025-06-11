<template>
  <div class="min-h-screen flex items-center justify-center bg-indigo-50">
    <form @submit.prevent="register" class="bg-white shadow-lg rounded-xl px-8 py-10 w-full max-w-md flex flex-col gap-5">
      <h2 class="text-2xl font-bold text-center text-indigo-700 mb-2">Crear Cuenta</h2>
      <input
        v-model="email"
        type="email"
        placeholder="Correo electrónico"
        required
        class="px-4 py-3 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition text-gray-700 bg-white placeholder-indigo-300"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Contraseña"
        required
        class="px-4 py-3 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition text-gray-700 bg-white placeholder-indigo-300"
      />
      <button
        type="submit"
        class="bg-indigo-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
      >
        Registrarse
      </button>
      <p v-if="error" class="text-red-500 text-center text-sm">{{ error }}</p>
      <p v-if="success" class="text-green-600 text-center text-sm">{{ success }}</p>
      <p class="text-center text-sm text-gray-600 mt-2">
        ¿Ya tienes una cuenta?
        <router-link to="/Login" class="text-indigo-600 hover:underline font-medium">Iniciar Sesión</router-link>
      </p>
    </form>
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

<!-- Tailwind CSS is used for all styling. Only two colors: indigo and white. -->
