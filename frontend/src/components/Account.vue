<template>
  <div class="max-w-lg w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 flex flex-col items-center gap-6 border border-gray-200 mx-auto transition-all duration-300 mt-8 md:mt-16 mb-8 md:mb-0">
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
      <button class="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-semibold shadow transition flex-1 sm:flex-none" @click="editing = true">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 10-4-4l-8 8v3z"/></svg>
        Editar
      </button>
      <button class="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold shadow transition flex-1 sm:flex-none" @click="showDelete = true">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12"/></svg>
        Eliminar
      </button>
    </div>
    <div v-else class="text-red-500 text-center mt-4">No hay usuario logueado.</div>

    <!-- Edit Modal -->
    <div v-if="editing" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col gap-4 relative">
        <h3 class="text-xl font-bold text-gray-800 mb-2">Editar cuenta</h3>
        <label class="text-gray-700 font-semibold">Email actual</label>
        <div class="w-full px-4 py-2 rounded border border-gray-200 bg-gray-50 text-gray-700 mb-2 select-all">{{ user.email }}</div>
        <label class="text-gray-700 font-semibold">Nuevo email</label>
        <input v-model="editEmail" type="email" class="w-full px-4 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-indigo-300 focus:outline-none text-gray-900" placeholder="Nuevo email (opcional)" />
        <label class="text-gray-700 font-semibold">Contraseña actual <span class='text-red-500'>*</span></label>
        <input v-model="currentPassword" type="password" class="w-full px-4 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-indigo-300 focus:outline-none text-gray-900" placeholder="••••••••" required />
        <label class="text-gray-700 font-semibold">Nueva contraseña</label>
        <input v-model="editPassword" type="password" class="w-full px-4 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-indigo-300 focus:outline-none text-gray-900" placeholder="•••••••• (opcional)" />
        <div class="flex gap-2 mt-4">
          <button @click="saveProfile" class="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded font-semibold transition">Guardar</button>
          <button @click="editing = false" class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded font-semibold transition">Cancelar</button>
        </div>
        <transition name="fade">
          <div v-if="editSuccess" class="fixed top-0 left-0 w-full flex justify-center z-50">
            <div class="bg-green-100 border-2 border-green-400 text-green-900 px-8 py-5 mt-10 rounded-2xl shadow-2xl text-xl font-bold flex items-center gap-3 max-w-2xl animate-fade-in">
              <svg class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" stroke-width="2"/><path d="M9 12l2 2 4-4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              {{ editSuccess }}
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- Delete Modal -->
    <div v-if="showDelete" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col gap-4 items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 text-red-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12"/></svg>
        <h3 class="text-xl font-bold text-gray-800 mb-2">¿Eliminar cuenta?</h3>
        <p class="text-gray-600 text-center">Esta acción es irreversible. ¿Estás seguro de que deseas eliminar tu cuenta?</p>
        <div class="flex gap-2 mt-4">
          <button @click="deleteAccount" class="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded font-semibold transition">Eliminar</button>
          <button @click="showDelete = false" class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded font-semibold transition">Cancelar</button>
        </div>
        <p v-if="deleteError" class="text-red-500 text-sm mt-2">{{ deleteError }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'
const showPassword = ref(false)
const editing = ref(false)
const showDelete = ref(false)
const editEmail = ref('')
const editPassword = ref('')
const currentPassword = ref('')
const editError = ref('')
const editSuccess = ref('')
const deleteError = ref('')
const authStore = useAuthStore()
const user = computed(() => authStore.user || { email: '', password: '' })

function formatDate(date) {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d)) return ''
  return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
}

function openEdit() {
  editEmail.value = user.value.email
  editPassword.value = ''
  currentPassword.value = ''
  editError.value = ''
  editSuccess.value = ''
  editing.value = true
}

async function saveProfile() {
  editError.value = ''
  editSuccess.value = ''
  if (!currentPassword.value) {
    editError.value = 'Debes ingresar tu contraseña actual.'
    return
  }
  try {
    const payload = { email: editEmail.value, currentPassword: currentPassword.value }
    if (editPassword.value) payload.password = editPassword.value
    await axios.put(`/api/auth/users/${user.value._id}`, payload)
    authStore.user = { ...user.value, email: editEmail.value }
    localStorage.setItem('user', JSON.stringify(authStore.user))
    editSuccess.value = 'Contraseña actualizada correctamente. Serás redirigido al login.'
    editPassword.value = ''
    currentPassword.value = ''
    setTimeout(() => {
      editing.value = false
      authStore.logout()
      window.location.href = '/login'
    }, 2000)
  } catch (err) {
    editError.value = err.response?.data?.message || 'Error al actualizar el perfil.'
  }
}

async function deleteAccount() {
  deleteError.value = ''
  try {
    await axios.delete(`/api/auth/users/${user.value._id}`)
    authStore.logout()
    window.location.href = '/login'
  } catch (err) {
    deleteError.value = err.response?.data?.message || 'Error al eliminar la cuenta.'
  }
}
</script>
