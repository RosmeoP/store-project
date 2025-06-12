<template>
  <div>
    <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <form @submit.prevent="addProduct" class="flex flex-col md:flex-row gap-2 items-center">
        <input v-model="newProduct.nombre" placeholder="Nombre" class="px-3 py-2 rounded border border-indigo-200 text-base bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400" required />
        <input v-model="newProduct.descripcion" placeholder="Descripción" class="px-3 py-2 rounded border border-indigo-200 text-base bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400" required />
        <input v-model.number="newProduct.precio" placeholder="Precio" type="number" min="0" class="px-3 py-2 rounded border border-indigo-200 text-base bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400" required />
        <button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded transition">Agregar Producto</button>
      </form>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="item in items" :key="item._id" class="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between min-h-[150px] border border-indigo-100 hover:shadow-xl transition">
        <div>
          <div class="font-bold text-xl mb-1 text-indigo-800">{{ item.nombre }}</div>
          <div class="text-gray-600 mb-2 text-base">{{ item.descripcion }}</div>
          <div class="text-indigo-700 font-semibold text-lg">${{ item.precio }}</div>
        </div>
        <div class="mt-4 flex gap-2">
          <button class="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded font-medium transition" @click="$emit('edit', item)">Editar</button>
          <button class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-medium transition" @click="$emit('delete', item._id)">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const AUTH_API = import.meta.env.VITE_AUTH_API_URL || '/api/auth'
const PRODUCTS_API = import.meta.env.VITE_PRODUCTS_API_URL || '/api/items'

const props = defineProps({
  items: Array
})
const emit = defineEmits(['refresh', 'edit', 'delete'])

const newProduct = ref({ nombre: '', descripcion: '', precio: null })
const BACKEND_URL = 'http://localhost:4000/api/items';

const addProduct = async () => {
  try {
    if (!newProduct.value.nombre || !newProduct.value.descripcion || newProduct.value.precio === null || newProduct.value.precio === '') {
      window.alert('Por favor, completa todos los campos para agregar un producto.');
      return;
    }
    if (isNaN(newProduct.value.precio) || Number(newProduct.value.precio) < 0) {
      window.alert('El precio debe ser un número positivo.');
      return;
    }
    await axios.post('/api/items', {
      nombre: newProduct.value.nombre,
      descripcion: newProduct.value.descripcion,
      precio: Number(newProduct.value.precio)
    });
    newProduct.value = { nombre: '', descripcion: '', precio: null };
    window.alert('¡Producto agregado exitosamente!');
    emit('refresh');
  } catch (err) {
    if (err.response && err.response.status === 404) {
      window.alert('No se pudo encontrar el servicio de productos. Puede estar apagado.');
    } else if (err.message === 'Network Error') {
      window.alert('No se pudo conectar con el servicio de productos. Puede estar apagado.');
    } else {
      window.alert('Error al agregar producto: ' + (err.response?.data?.error || err.message));
    }
  }
}
</script>
