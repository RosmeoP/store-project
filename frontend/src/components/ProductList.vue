<template>
  <div>
    <!-- Form to Add Product -->
    <div class="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <form @submit.prevent="addProduct" class="flex flex-col md:flex-row gap-2 items-center w-full">
        <input v-model="newProduct.nombre" placeholder="Nombre" class="px-3 py-2 rounded border border-indigo-200 text-base bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400" required />
        <input v-model="newProduct.descripcion" placeholder="Descripción" class="px-3 py-2 rounded border border-indigo-200 text-base bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400" required />
        <input v-model.number="newProduct.precio" placeholder="Precio" type="number" step="0.01" min="0" class="px-3 py-2 rounded border border-indigo-200 text-base bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400" required />
        
        <!-- Drag and Drop Image Upload -->
        <div
          class="border-2 border-dashed border-indigo-300 rounded-md px-4 py-6 text-center cursor-pointer bg-indigo-50 hover:bg-indigo-100 transition w-full md:w-48"
          @dragover.prevent
          @drop.prevent="handleDrop"
          @click="triggerFileSelect"
        >
          <p class="text-sm text-indigo-700">Arrastra una imagen aquí o haz clic para subir</p>
          <input ref="fileInput" type="file" accept="image/*" @change="onFileChange" class="hidden" />
          <img v-if="newProduct.img" :src="newProduct.img" class="mt-3 w-20 h-20 object-cover mx-auto rounded shadow border border-indigo-200" />
        </div>

        <button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded transition">Agregar Producto</button>
      </form>
    </div>

    <!-- Product Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="item in items" :key="item._id" class="bg-gradient-to-br from-indigo-50 via-white to-indigo-100 rounded-2xl shadow-xl p-6 flex flex-col justify-between min-h-[220px] border border-indigo-200 hover:shadow-2xl transition group relative overflow-hidden">
        <div class="absolute right-4 top-4 flex gap-2">
          <span class="inline-block bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">ID: {{ item._id.slice(-6) }}</span>
          <button @click="toggleFavorite(item)" :aria-label="item.favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'" class="focus:outline-none">
            <svg v-if="item.favorite" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-pink-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-300 hover:text-pink-400 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </button>
        </div>
        <div class="flex flex-col items-center gap-3 mb-2">
          <img v-if="item.img" :src="item.img" alt="Imagen del producto" class="w-24 h-24 object-cover rounded-xl border border-indigo-100 shadow" @error="e => e.target.src = 'https://placehold.co/120x120?text=Producto'" />
          <img v-else src="https://placehold.co/120x120?text=Producto" alt="Imagen por defecto" class="w-24 h-24 object-cover rounded-xl border border-indigo-100 shadow" />
          <div class="w-12 h-12 rounded-xl bg-indigo-200 flex items-center justify-center text-indigo-700 text-2xl font-bold shadow-inner -mt-8 z-10 relative">
            {{ (item.nombre ? item.nombre.charAt(0).toUpperCase() : '?') }}
          </div>
          <div class="text-center">
            <div class="font-extrabold text-xl text-indigo-900 group-hover:text-indigo-700 transition">{{ item.nombre }}</div>
            <div class="text-gray-500 text-sm">{{ item.descripcion }}</div>
          </div>
        </div>
        <div class="flex items-center justify-between mt-4">
          <div class="text-2xl font-bold text-indigo-700 group-hover:text-indigo-900 transition">${{ Number(item.precio).toFixed(2) }}</div>
          <div class="flex gap-2">
            <button class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold shadow transition flex items-center gap-1" @click="addToCart(item)">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4"/><circle cx="7" cy="21" r="1"/><circle cx="17" cy="21" r="1"/></svg>
              Añadir
            </button>
            <button class="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-semibold shadow transition flex items-center gap-1" @click="$emit('edit', item)">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 10-4-4l-8 8v3z"/></svg>
              Editar
            </button>
            <button class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow transition flex items-center gap-1" @click="$emit('delete', item._id)">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12"/></svg>
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const props = defineProps({
  items: Array
})
const emit = defineEmits(['refresh', 'edit', 'delete'])

const newProduct = ref({ nombre: '', descripcion: '', precio: null, img: '', file: null })
const fileInput = ref(null)
const cart = ref([])

function triggerFileSelect() {
  fileInput.value.click()
}

function onFileChange(e) {
  const file = e.target.files[0]
  if (file) {
    newProduct.value.file = file
    const reader = new FileReader()
    reader.onload = (ev) => {
      newProduct.value.img = ev.target.result
    }
    reader.readAsDataURL(file)
  }
}

function handleDrop(e) {
  const file = e.dataTransfer.files[0]
  if (file) {
    newProduct.value.file = file
    const reader = new FileReader()
    reader.onload = (ev) => {
      newProduct.value.img = ev.target.result
    }
    reader.readAsDataURL(file)
  }
}

async function addProduct() {
  try {
    if (!newProduct.value.nombre || !newProduct.value.descripcion || !newProduct.value.precio) {
      alert('Faltan campos');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', newProduct.value.nombre);
    formData.append('descripcion', newProduct.value.descripcion);
    formData.append('precio', newProduct.value.precio);

    if (newProduct.value.file) {
      formData.append('img', newProduct.value.file); 
    }

    await axios.post('/api/items', formData);

    alert('Producto agregado correctamente');
    newProduct.value = { nombre: '', descripcion: '', precio: null, img: '', file: null };
    emit('refresh');
  } catch (err) {
    if (err.response) {
      console.error('Error al agregar producto:', err.response.data, err.response.status);
      alert('Error: ' + (err.response.data?.error || err.response.data?.message || 'Error al agregar producto'));
    } else if (err.request) {
      console.error('No response:', err.request);
      alert('No response from backend');
    } else {
      console.error('Error:', err.message);
      alert('Error: ' + err.message);
    }
  }
}



function toggleFavorite(item) {
  item.favorite = !item.favorite
}

function addToCart(item) {
  cart.value.push(item)
  alert('Producto añadido al carrito')
}
</script>
