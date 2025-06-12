<template>
  <div class="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 mt-8">
    <h2 class="text-2xl font-bold text-indigo-700 mb-4 text-center">Mi Cuenta</h2>
    <div v-if="user.email" class="mb-4">
      <span class="font-semibold text-indigo-700">Email:</span> {{ user.email }}
    </div>
    <div v-else class="mb-4 text-red-500 text-center">
      No hay usuario logueado.
    </div>
    <div v-if="user.email" class="mb-4">
      <span class="font-semibold text-indigo-700">Contraseña:</span>
      <span class="text-gray-500">••••••••</span>
      <button v-if="user.password" class="ml-2 text-sm text-indigo-500 hover:underline" @click="showPassword = !showPassword">{{ showPassword ? 'Ocultar' : 'Mostrar' }}</button>
      <span v-if="showPassword && user.password" class="ml-2 text-gray-700">{{ user.password }}</span>
    </div>
    <div v-if="user.email" class="flex gap-2 mt-4">
      <button class="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded transition" @click="$emit('edit-user')">Editar</button>
      <button class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition" @click="$emit('delete-user')">Eliminar</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
const showPassword = ref(false)
const authStore = useAuthStore()
const user = computed(() => authStore.user || { email: '', password: '' })
</script>
