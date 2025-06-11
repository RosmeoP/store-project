<template>
  <div class="min-h-screen bg-indigo-50">
    <nav class="flex justify-between items-center bg-indigo-700 px-6 py-4 text-white font-semibold shadow">
      <div class="text-lg tracking-wide">Mi App - Productos y Usuarios</div>
      <button class="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition" @click="logout">Cerrar sesión</button>
    </nav>
    <div class="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-2xl shadow-lg">
      <h1 class="text-3xl font-bold text-center text-indigo-700 mb-8">Productos</h1>
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
      <hr class="my-10" />
      <h2 class="text-2xl font-bold text-indigo-700 mb-4">Usuarios</h2>
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import ProductList from './ProductList.vue'

const users = ref([])
const showCreate = ref(false)
const selectedUser = ref(null)
const userToDelete = ref(null)
const items = ref([])

const editProduct = ref({ nombre: '', descripcion: '', precio: null })
const editProductId = ref(null)

const fetchUsers = async () => {
  const res = await axios.get('http://localhost:4000/api/auth/users')
  users.value = res.data
}

const fetchItems = async () => {
  const res = await axios.get('http://localhost:4000/api/items')
  items.value = res.data
}

const deleteProduct = async (id) => {
  await axios.delete(`http://localhost:4000/api/items/${id}`)
  fetchItems()
}

const startEdit = (item) => {
  editProductId.value = item._id
  editProduct.value = { ...item }
}

const updateProduct = async () => {
  await axios.put(`http://localhost:4000/api/items/${editProductId.value}`, editProduct.value)
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

onMounted(() => {
  fetchUsers()
  fetchItems()
})
</script>

<style scoped>
</style>
