<template>
  <router-view />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const items = ref([]);
const loading = ref(false);
const error = ref(null);
const showForm = ref(false);
const itemToEdit = ref(null);

// URLs desde .env
const PRODUCTS_API_URL = import.meta.env.VITE_PRODUCTS_API_URL?.replace(/\/+$/, '');

// Obtener todos los items
const fetchItems = async () => {
  try {
    loading.value = true;
    error.value = null;

    // /api/items ya es la URL completa
    const response = await axios.get(PRODUCTS_API_URL);
    items.value = response.data;

  } catch (err) {
    console.error('Error al cargar items:', err);
    error.value = 'No se pudieron cargar los items.';
  } finally {
    loading.value = false;
  }
};


// Editar item
const editItem = (item) => {
  itemToEdit.value = item;
  showForm.value = true;
};

// Cancelar formulario
const cancelForm = () => {
  showForm.value = false;
  itemToEdit.value = null;
};

// Ejecutar al montar
onMounted(() => {
  fetchItems();
});
</script>
