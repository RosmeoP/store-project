<template>
  <div class="max-w-lg w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 flex flex-col items-center gap-6 border border-gray-200 mx-auto transition-all duration-300 mt-8 md:mt-16 mb-8 md:mb-0 md:ml-24">
    <div class="w-full">
      <div v-if="user.email" class="mb-4">
        <div class="bg-green-50 border border-green-200 text-green-700 rounded-lg px-2 py-2 text-center font-semibold text-sm shadow-sm animate-fade-in truncate max-w-full">
          ¡Bienvenido, <span class="break-all">{{ user.email.split('@')[0] }}</span>!
        </div>
      </div>
    </div>
    <div class="flex flex-col items-center gap-2">
      <div class="bg-gradient-to-br from-gray-400 via-gray-500 to-gray-700 rounded-full p-2 shadow-lg">
        <div class="w-16 h-16 flex items-center justify-center rounded-full bg-white text-gray-700 text-4xl font-extrabold uppercase">
          {{ user.email ? user.email.charAt(0) : '?' }}
        </div>
      </div>
      <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-800 mt-2 text-center break-all">{{ user.email || 'Mi Cuenta' }}</h2>
      <p class="text-sm sm:text-base text-gray-400 text-center">Gestiona tu información personal y seguridad</p>
    </div>
    <div class="w-full flex flex-col gap-4 mt-4">
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3">
        <span class="font-semibold text-gray-700 w-32 min-w-[8rem]">Email:</span>
        <span class="text-gray-900 text-base sm:text-lg break-all">{{ user.email }}</span>
      </div>
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3">
        <span class="font-semibold text-gray-700 w-32 min-w-[8rem]">Contraseña:</span>
        <span class="text-gray-500">••••••••</span>
        <button v-if="user.password" class="ml-2 text-sm text-gray-500 hover:underline" @click="showPassword = !showPassword">{{ showPassword ? 'Ocultar' : 'Mostrar' }}</button>
        <span v-if="showPassword && user.password" class="ml-2 text-gray-700">{{ user.password }}</span>
      </div>
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3">
        <span class="font-semibold text-gray-700 w-32 min-w-[8rem]">Miembro desde:</span>
        <span class="text-gray-900 text-base sm:text-lg">{{ user.createdAt ? formatDate(user.createdAt) : 'No disponible' }}</span>
      </div>
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3">
        <span class="font-semibold text-gray-700 w-32 min-w-[8rem]">ID de usuario:</span>
        <span class="text-gray-400 text-xs break-all">{{ user._id || '—' }}</span>
      </div>
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3">
        <span class="font-semibold text-gray-700 w-32 min-w-[8rem]">Estado:</span>
        <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
          <svg class="w-3 h-3 inline" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="10" r="10"/></svg>
          Activo
        </span>
      </div>
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3">
        <span class="font-semibold text-gray-700 w-32 min-w-[8rem]">Rol:</span>
        <span class="text-gray-700 text-sm">Usuario</span>
      </div>
      <div class="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-3">
        <span class="font-semibold text-gray-700 w-32 min-w-[8rem]">Última actualización:</span>
        <span class="text-gray-500 text-xs">{{ user.updatedAt ? formatDate(user.updatedAt) : '—' }}</span>
      </div>
    </div>
    <div v-if="user.email" class="flex flex-col sm:flex-row gap-3 mt-6 w-full justify-center">
      <button class="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-semibold shadow transition flex-1 sm:flex-none" @click="$emit('edit-user')">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 10-4-4l-8 8v3z"/></svg>
        Editar
      </button>
      <button class="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold shadow transition flex-1 sm:flex-none" @click="$emit('delete-user')">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12"/></svg>
        Eliminar
      </button>
    </div>
    <div v-else class="text-red-500 text-center mt-4">No hay usuario logueado.</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
const showPassword = ref(false)
const authStore = useAuthStore()
const user = computed(() => authStore.user || { email: '', password: '' })
function formatDate(date) {
  if (!date) return ''
  // Si date es string, intenta convertir
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d)) return ''
  return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>
