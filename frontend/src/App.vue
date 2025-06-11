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

const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL;
const PRODUCTS_API_URL = import.meta.env.VITE_PRODUCTS_API_URL;

// Obtener todos los items de la API
const fetchItems = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await axios.get(`${PRODUCTS_API_URL}/items`);
    items.value = response.data;
  } catch (err) {
    console.error('Error al cargar items:', err);
    error.value = 'No se pudieron cargar los items. Por favor, intenta de nuevo más tarde.';
  } finally {
    loading.value = false;
  }
};

// Editar un item existente
const editItem = (item) => {
  itemToEdit.value = item;
  showForm.value = true;
};

// Cancelar el formulario
const cancelForm = () => {
  showForm.value = false;
  itemToEdit.value = null;
};

// Cargar items al montar el componente
onMounted(() => {
  fetchItems();
});
</script>

