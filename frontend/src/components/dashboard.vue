<template>
  <div>
    <nav class="navbar">
      <div class="nav-left">Mi App - Usuarios</div>
      <button class="logout-btn" @click="logout">Cerrar sesión</button>
    </nav>

    <div class="container">
      <h1>Usuarios</h1>
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

const fetchUsers = async () => {
  const res = await axios.get('http://localhost:4000/api/auth/users')
  users.value = res.data
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

onMounted(fetchUsers)
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
</style>
