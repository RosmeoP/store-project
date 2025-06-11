<template>
  <div>
    <nav class="navbar">
      <div class="nav-left">Mi App - Usuarios</div>
      <button class="logout-btn" @click="logout">Cerrar sesión</button>
    </nav>

    <div class="container">
      <h1>Productos</h1>
      <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <form @submit.prevent="addProduct" class="flex flex-col md:flex-row gap-2 items-center">
          <input v-model="newProduct.nombre" placeholder="Nombre" class="input" required />
          <input v-model="newProduct.descripcion" placeholder="Descripción" class="input" required />
          <input v-model.number="newProduct.precio" placeholder="Precio" type="number" min="0" class="input" required />
          <button type="submit" class="btn">Agregar Producto</button>
        </form>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="item in items" :key="item._id" class="product-card">
          <div>
            <div class="font-bold text-lg">{{ item.nombre }}</div>
            <div class="text-gray-600 mb-2">{{ item.descripcion }}</div>
            <div class="text-indigo-700 font-semibold">${{ item.precio }}</div>
          </div>
          <div class="mt-4 flex gap-2">
            <button class="btn-edit" @click="startEdit(item)">Editar</button>
            <button class="btn-danger" @click="deleteProduct(item._id)">Eliminar</button>
          </div>
        </div>
      </div>
      <div v-if="editProductId" class="edit-modal">
        <form @submit.prevent="updateProduct" class="edit-form">
          <input v-model="editProduct.nombre" placeholder="Nombre" class="input" required />
          <input v-model="editProduct.descripcion" placeholder="Descripción" class="input" required />
          <input v-model.number="editProduct.precio" placeholder="Precio" type="number" min="0" class="input" required />
          <div class="flex gap-2 mt-2">
            <button type="submit" class="btn">Guardar</button>
            <button type="button" class="btn-cancel" @click="cancelEdit">Cancelar</button>
          </div>
        </form>
      </div>
      <hr class="my-6" />
      <h2>Usuarios</h2>
      <button @click="showCreate = true">Agregar Usuario</button>
      <ul>
        <li v-for="user in users" :key="user._id">
          {{ user.email }}
          <button @click="editUser(user)">Editar</button>
          <button class="danger" @click="deleteUser(user)">Eliminar</button>
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

const users = ref([])
const showCreate = ref(false)
const selectedUser = ref(null)
const userToDelete = ref(null)
const items = ref([])

const newProduct = ref({ nombre: '', descripcion: '', precio: null })
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

const addProduct = async () => {
  await axios.post('http://localhost:4000/api/items', newProduct.value)
  newProduct.value = { nombre: '', descripcion: '', precio: null }
  fetchItems()
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
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #3b82f6;
  padding: 0.75rem 1rem;
  color: white;
  font-weight: 600;
  font-family: system-ui, sans-serif;
}

.logout-btn {
  background: #ef4444;
  border: none;
  padding: 0.4rem 0.9rem;
  border-radius: 0.375rem;
  cursor: pointer;
  color: white;
  font-size: 0.875rem;
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background: #dc2626;
}

.container {
  max-width: 600px;
  margin: 2rem auto;
  font-family: system-ui, sans-serif;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

h1 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #1f2937;
}

button {
  margin: 0.3rem;
  background-color: #3b82f6;
  border: none;
  color: white;
  padding: 0.4rem 0.9rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #2563eb;
}

button.danger {
  background-color: #ef4444;
}

button.danger:hover {
  background-color: #dc2626;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  background: white;
  margin-bottom: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.input {
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid #c7d2fe;
  font-size: 1rem;
  margin-right: 0.5rem;
  background: #fff;
}
.btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.4rem 0.9rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background 0.2s;
}
.btn:hover {
  background: #2563eb;
}
.btn-danger {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.4rem 0.9rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background 0.2s;
}
.btn-danger:hover {
  background: #dc2626;
}
.btn-edit {
  background: #f59e42;
  color: white;
  border: none;
  padding: 0.4rem 0.9rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background 0.2s;
}
.btn-edit:hover {
  background: #d97706;
}
.btn-cancel {
  background: #6b7280;
  color: white;
  border: none;
  padding: 0.4rem 0.9rem;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background 0.2s;
}
.btn-cancel:hover {
  background: #374151;
}
.product-card {
  background: #fff;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 1.2rem 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 150px;
}
.edit-modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}
.edit-form {
  background: #fff;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  padding: 2rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 320px;
}
</style>
