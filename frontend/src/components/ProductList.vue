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
   

    <!-- Product Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mx-auto">
      <div
        v-for="item in items"
        :key="item._id"
        class="bg-gradient-to-br from-indigo-50 via-white to-indigo-100 rounded-2xl shadow-xl p-6 flex flex-col justify-between min-h-[320px] border border-indigo-200 hover:shadow-2xl transition group relative overflow-hidden"
      >
        <button
          class="absolute top-3 right-3 z-20 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow hover:bg-pink-100 transition"
          @click="toggleFavorite(item)"
          :aria-label="item.favorite ? 'Quitar de favoritos' : 'Agregar a favoritos'"
        >
          <svg
            :class="item.favorite ? 'text-pink-500 fill-pink-500' : 'text-gray-400'"
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            />
          </svg>
        </button>
        <div class="flex flex-col items-center gap-3 mb-2">
          <img
            v-if="item.img"
            :src="item.img"
            alt="Imagen del producto"
            class="w-full h-64 object-cover rounded-xl border border-indigo-100 shadow"
            @error="e => e.target.src = 'https://placehold.co/600x300?text=Producto'"
          />
          <img
            v-else
            src="https://placehold.co/600x300?text=Producto"
            alt="Imagen por defecto"
            class="w-full h-64 object-cover rounded-xl border border-indigo-100 shadow"
          />
          <div class="text-center w-full">
            <div class="font-extrabold text-xl text-indigo-900 group-hover:text-indigo-700 transition">{{ item.nombre }}</div>
            <div class="text-gray-500 text-sm">{{ item.descripcion }}</div>
          </div>
        </div>
        <div class="flex items-center justify-between mt-4">
          <div class="text-2xl font-bold text-indigo-700 group-hover:text-indigo-900 transition">${{ Number(item.precio).toFixed(2) }}</div>
          <button class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold shadow transition flex items-center gap-1" @click="addToCart(item)">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4"/><circle cx="7" cy="21" r="1"/><circle cx="17" cy="21" r="1"/></svg>
            Añadir
          </button>
        </div>
        <div class="flex gap-2 mt-4 justify-end">
          <button
            class="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-lg font-semibold shadow transition flex items-center gap-1 text-sm"
            @click="startEdit(item)" 
          >
            Editar
          </button>
          <button
            class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg font-semibold shadow transition flex items-center gap-1 text-sm"
            @click="confirmDelete(item._id)"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Product Modal -->
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
</template>

<script setup>
import { ref } from 'vue'
import Swal from 'sweetalert2'
import axios from 'axios';


const props = defineProps({
  items: Array
})
const emit = defineEmits(['refresh', 'edit', 'delete'])

const newProduct = ref({ nombre: '', descripcion: '', precio: null, img: '', file: null })
const fileInput = ref(null)
const cart = ref([])

const editProduct = ref({ nombre: '', descripcion: '', precio: null })
const editProductId = ref(null)
const showAddModal = ref(false)
const dragActive = ref(false);

function startEdit(item) {
  editProductId.value = item._id
  editProduct.value = { ...item } 
}

const updateProduct = async () => {
  try {
    await axios.put(`/api/items/${editProductId.value}`, editProduct.value);

    editProductId.value = null;
    editProduct.value = { nombre: '', descripcion: '', precio: null };

    emit('refresh');

    Swal.fire('¡Éxito!', 'Producto editado correctamente', 'success');
  } catch (err) {
    Swal.fire('Error', 'Hubo un problema al actualizar el producto', 'error');
  }
};


const cancelEdit = () => {
  editProductId.value = null
  editProduct.value = { nombre: '', descripcion: '', precio: null }
}

function toggleFavorite(item) {
  item.favorite = !item.favorite
}

function addToCart(item) {
  cart.value.push(item)
  Swal.fire('¡Añadido!', 'Producto añadido al carrito', 'success')
}

function confirmDelete(id) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: "¡Esta acción no se puede deshacer!",
    icon: 'warning',
    iconColor: '#ef4444',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6366f1',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      emit('delete', id)
      Swal.fire('Eliminado', 'El producto ha sido eliminado.', 'success')
    }
  })
}

const addProduct = async () => {
  try {
    const formData = new FormData();
    formData.append('nombre', newProduct.value.nombre);
    formData.append('descripcion', newProduct.value.descripcion);
    formData.append('precio', newProduct.value.precio);
    if (newProduct.value.file) {
      formData.append('img', newProduct.value.file);
    }

    await axios.post('/api/items', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    newProduct.value = { nombre: '', descripcion: '', precio: null, img: '', file: null };
    showAddModal.value = false;

    emit('refresh');

    Swal.fire('¡Éxito!', 'Producto agregado correctamente', 'success');
  } catch (err) {
    Swal.fire('Error', 'Hubo un problema al agregar el producto', 'error');
  }
};

const cancelAdd = () => {
  newProduct.value = { nombre: '', descripcion: '', precio: null, img: '', file: null }
  showAddModal.value = false
}

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
</script>
