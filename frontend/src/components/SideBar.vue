<template>
  <aside :class="['fixed md:static z-30 inset-y-0 left-0 flex flex-col bg-white shadow-lg transition-transform duration-200 w-64 h-full min-h-screen', sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0']">
    <div class="flex items-center gap-3 px-6 py-6 border-b border-indigo-100">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M3 21v-2a4 4 0 014-4h10a4 4 0 014 4v2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="12" cy="7" r="4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="font-bold text-xl text-indigo-700">Ecommerce</span>
    </div>
    <div class="px-6 py-4 border-b border-indigo-100">
      <div class="flex items-center gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <circle cx="12" cy="12" r="10" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="12" cy="10" r="3" />
          <path d="M12 13v4" />
        </svg>
        <span class="font-medium text-indigo-900 truncate">{{ userEmail }}</span>
      </div>
    </div>
    <nav class="flex-1 flex flex-col gap-2 px-4 py-6">
      <button v-for="section in sections" :key="section.key"
        @click="$emit('change-section', section.key)"
        :class="['flex items-center gap-2 px-3 py-2 rounded transition',
          activeSection === section.key ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-indigo-50 text-indigo-900']">
        <component :is="section.icon" class="w-5 h-5" />
        <span>{{ section.label }}</span>
      </button>
    </nav>
    <div class="px-6 pb-6 mt-auto">
      <button @click="$emit('logout')" class="flex items-center gap-2 w-full px-3 py-2 rounded hover:bg-red-100 text-red-600 transition">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M17 16l4-4m0 0l-4-4m4 4H7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M3 21V3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Cerrar sesión
      </button>
    </div>
  </aside>
</template>

<script setup>
const props = defineProps({
  userEmail: String,
  activeSection: String,
  sidebarOpen: Boolean,
  sections: Array
})
const emit = defineEmits(['change-section', 'logout'])
</script>

<style scoped>
@media (max-width: 767px) {
  aside {
    width: 80vw;
    min-width: 220px;
    max-width: 320px;
  }
}
</style>
