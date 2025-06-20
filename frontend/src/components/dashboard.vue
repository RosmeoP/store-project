<template>
  <main class="min-h-screen bg-gray-50 md:ml-64 transition-all">
    <!-- Sidebar -->
    <SideBar
      :user-email="currentUser?.email || 'Usuario'"
      :active-section="activeSection"
      :sidebar-open="sidebarOpen"
      :sections="sections"
      @change-section="changeSection"
      @logout="logout"
      @edit-user="editUser"
      @delete-user="deleteUser"
    />
    <!-- Overlay for mobile -->
    <div class="fixed inset-0 bg-black bg-opacity-30 z-10 md:hidden" v-if="sidebarOpen" @click="sidebarOpen = false"></div>
    <!-- Main Content -->
    <div class="flex-1 p-4">
      <button class="md:hidden mb-4 text-indigo-700" @click="sidebarOpen = !sidebarOpen">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div v-if="activeSection === 'products'">
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
     
      <div v-else-if="activeSection === 'about'">
        <h2 class="text-2xl font-bold text-indigo-700 mb-4 text-center">Acerca de</h2>
        <div class="bg-indigo-50 rounded-lg p-6 shadow text-indigo-900">
          <p class="mb-2">Este es un panel de administración de ejemplo con microservicios, productos y usuarios.</p>
          <p class="text-sm text-indigo-500">Desarrollado con Vue 3, Tailwind CSS y Lucide Icons.</p>
        </div>
      </div>
      <div v-else-if="activeSection === 'account'">
        <Account @edit-user="editUser" @delete-user="deleteUser" />
        <EditUserForm v-if="showEditUser" :user="currentUser" @close="showEditUser = false" @refresh="fetchUsers" />
        <DeleteUserForm v-if="showDeleteUser" :user="currentUser" @close="showDeleteUser = false" @refresh="fetchUsers" />
      </div>
      <!-- Welcome Message -->
      <transition name="fade">
        <div v-if="showWelcome && authStore.user" class="fixed top-6 left-1/2 z-50 -translate-x-1/2 bg-green-50 border border-green-300 text-green-800 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in font-semibold text-lg max-w-[90vw]">
          <svg class="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" stroke-width="2"/><path d="M9 12l2 2 4-4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          ¡Bienvenido, <span class="font-bold break-all">{{ authStore.user.email.split('@')[0] }}</span>!
        </div>
      </transition>
    </div>
</main>
</template>

<script setup>
import { ref, onMounted, computed, h } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import ProductList from './ProductList.vue'
import SideBar from './SideBar.vue'
import Account from './Account.vue'

const users = ref([])
const showCreate = ref(false)
const selectedUser = ref(null)
const userToDelete = ref(null)
const items = ref([])

const editProduct = ref({ nombre: '', descripcion: '', precio: null })
const editProductId = ref(null)
const sidebarOpen = ref(false)
const activeSection = ref('products')

const showEditUser = ref(false)
const showDeleteUser = ref(false)
const showWelcome = ref(false)

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

const editUser = () => {
  showEditUser.value = true
}

const deleteUser = () => {
  showDeleteUser.value = true
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
  if (authStore.user && sessionStorage.getItem('justLoggedIn')) {
    showWelcome.value = true
    setTimeout(() => showWelcome.value = false, 3500)
    sessionStorage.removeItem('justLoggedIn')
  }
})

const startEdit = (item) => {
  editProductId.value = item._id;
  editProduct.value = { ...item }; 
};

</script>

<style scoped>
</style>