<template>
  <div class="min-h-screen flex bg-indigo-50">
    <!-- Sidebar -->
    <SideBar
      :user-email="currentUser?.email || 'Usuario'"
      :active-section="activeSection"
      :sidebar-open="sidebarOpen"
      :sections="sections"
      @change-section="changeSection"
      @logout="logout"
    />
    <!-- Overlay for mobile -->
    <div class="fixed inset-0 bg-black bg-opacity-30 z-10 md:hidden" v-if="sidebarOpen" @click="sidebarOpen = false"></div>
    <!-- Main Content -->
    <div class="flex-1 md:ml-64 p-4">
      <button class="md:hidden mb-4 text-indigo-700" @click="sidebarOpen = !sidebarOpen">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div v-if="activeSection === 'products'">
        <h1 class="text-3xl font-bold text-indigo-700 mb-8 text-center">Productos</h1>
        <ProductList
          :items="items"
          @refresh="fetchItems"
          @edit="startEdit"
          @delete="deleteProduct"
        />
        <div v-if="editProductId" class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <form @submit.prevent="updateProduct" class="bg-white rounded-xl shadow-xl p-8 flex flex-col gap-4 min-w-[320px]">
            <h2 class="text-xl font-semibold text-indigo-700 mb-2">Editar Producto</h2>
            <input v-model="editProduct.nombre" placeholder="Nombre" class="px-3 py-2 rounded border border-indigo-200 text-base bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400" required />
            <input v-model="editProduct.descripcion" placeholder="Descripción" class="px-3 py-2 rounded border border-indigo-200 text-base bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400" required />
            <input v-model.number="editProduct.precio" placeholder="Precio" type="number" min="0" class="px-3 py-2 rounded border border-indigo-200 text-base bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400" required />
            <div class="flex gap-2 mt-2">
              <button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded font-medium transition">Guardar</button>
              <button type="button" class="bg-gray-400 hover:bg-gray-600 text-white px-4 py-2 rounded font-medium transition" @click="cancelEdit">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
      <div v-else-if="activeSection === 'users'">
        <h2 class="text-2xl font-bold text-indigo-700 mb-4 text-center">Usuarios</h2>
        <button class="mb-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition" @click="showCreate = true">Agregar Usuario</button>
        <ul class="space-y-3">
          <li v-for="user in users" :key="user._id" class="flex justify-between items-center bg-indigo-50 rounded-lg px-4 py-3 shadow">
            <span class="text-indigo-900 font-medium">{{ user.email }}</span>
            <div class="flex gap-2">
              <button class="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded transition" @click="editUser(user)">Editar</button>
              <button class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition" @click="deleteUser(user)">Eliminar</button>
            </div>
          </li>
        </ul>
        <CreateUserForm v-if="showCreate" @close="showCreate = false" @refresh="fetchUsers" />
        <EditUserForm v-if="selectedUser" :user="selectedUser" @close="selectedUser = null" @refresh="fetchUsers" />
        <DeleteUserForm v-if="userToDelete" :user="userToDelete" @close="userToDelete = null" @refresh="fetchUsers" />
      </div>
      <div v-else-if="activeSection === 'about'">
        <h2 class="text-2xl font-bold text-indigo-700 mb-4 text-center">Acerca de</h2>
        <div class="bg-indigo-50 rounded-lg p-6 shadow text-indigo-900">
          <p class="mb-2">Este es un panel de administración de ejemplo con microservicios, productos y usuarios.</p>
          <p class="text-sm text-indigo-500">Desarrollado con Vue 3, Tailwind CSS y Lucide Icons.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, h } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import ProductList from './ProductList.vue'
import SideBar from './SideBar.vue'

const users = ref([])
const showCreate = ref(false)
const selectedUser = ref(null)
const userToDelete = ref(null)
const items = ref([])

const editProduct = ref({ nombre: '', descripcion: '', precio: null })
const editProductId = ref(null)
const sidebarOpen = ref(false)
const activeSection = ref('products')

const sections = [
  { key: 'products', label: 'Productos', icon: { render() { return h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'w-5 h-5', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [h('rect', { x: 3, y: 7, width: 18, height: 13, rx: 2, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }), h('path', { d: 'M16 3v4M8 3v4' })]) } } },
  { key: 'users', label: 'Usuarios', icon: { render() { return h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'w-5 h-5', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [h('path', { d: 'M17 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }), h('circle', { cx: 9, cy: 7, r: 4, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }), h('circle', { cx: 17, cy: 17, r: 3 })]) } } },
  { key: 'about', label: 'Acerca de', icon: { render() { return h('svg', { xmlns: 'http://www.w3.org/2000/svg', class: 'w-5 h-5', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [h('circle', { cx: 12, cy: 12, r: 10, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }), h('circle', { cx: 12, cy: 10, r: 3 }), h('path', { d: 'M12 13v4' })]) } } },
]

const authStore = useAuthStore()
const currentUser = computed(() => authStore.user || { email: 'usuario@correo.com' })

const fetchUsers = async () => {
  try {
    const res = await axios.get('/api/auth/users')
    users.value = res.data
  } catch (e) {
    users.value = []
  }
}

const fetchItems = async () => {
  try {
    const res = await axios.get('/api/items')
    items.value = res.data
  } catch (e) {
    items.value = []
    window.alert('No se pudo conectar con el servicio de productos. Por favor, intenta más tarde.')
  }
}

const deleteProduct = async (id) => {
  await axios.delete(`/api/items/${id}`)
  fetchItems()
}

const startEdit = (item) => {
  editProductId.value = item._id
  editProduct.value = { ...item }
}

const updateProduct = async () => {
  await axios.put(`/api/items/${editProductId.value}`, editProduct.value)
  editProductId.value = null
  editProduct.value = { nombre: '', descripcion: '', precio: null }
  fetchItems()
}

const cancelEdit = () => {
  editProductId.value = null
  editProduct.value = { nombre: '', descripcion: '', precio: null }
}

const editUser = (user) => {
  selectedUser.value = { ...user }
}

const deleteUser = (user) => {
  userToDelete.value = user
}

const logout = () => {
  useAuthStore().logout()
  window.location.href = '/login'
}

const changeSection = (section) => {
  activeSection.value = section
  sidebarOpen.value = false
}

onMounted(() => {
  fetchUsers()
  fetchItems()
})
</script>

<style scoped>
</style>