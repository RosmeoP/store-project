<!-- components/Sidebar.vue -->
<template>
  <aside :class="['fixed md:static z-30 inset-y-0 left-0 flex flex-col bg-gradient-to-b from-indigo-700 via-indigo-600 to-indigo-800 shadow-xl transition-transform duration-200 w-64 h-full min-h-screen', sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0']">
    <div class="flex items-center gap-3 px-6 py-6 border-b border-indigo-500">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M3 21v-2a4 4 0 014-4h10a4 4 0 014 4v2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="12" cy="7" r="4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="font-bold text-xl text-yellow-300 tracking-wide">Ecommerce</span>
    </div>
    <nav class="flex-1 flex flex-col gap-2 px-4 py-6">
      <div class="mb-2 text-xs text-yellow-200 font-semibold tracking-wider">EXPLORA</div>
      <button class="flex items-center gap-2 px-3 py-2 rounded transition hover:bg-yellow-100/10 text-yellow-100" @click="$emit('change-section', 'popular')">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>Popular Products</span>
      </button>
      <button class="flex items-center gap-2 px-3 py-2 rounded transition hover:bg-yellow-100/10 text-yellow-100" @click="$emit('change-section', 'explore')">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
        <span>Explore New</span>
      </button>
      <button class="flex items-center gap-2 px-3 py-2 rounded transition hover:bg-yellow-100/10 text-yellow-100" @click="$emit('change-section', 'gifts')">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3a4 4 0 01-8 0"/></svg>
        <span>Gifts & Living</span>
      </button>
      <button class="flex items-center gap-2 px-3 py-2 rounded transition hover:bg-yellow-100/10 text-yellow-100" @click="$emit('change-section', 'inspiration')">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 16h-1v-4h-1m1-4h.01"/><circle cx="12" cy="12" r="10"/></svg>
        <span>Inspiration</span>
      </button>
      <div class="my-3 border-t border-yellow-200/30"></div>
      <div class="mb-2 text-xs text-yellow-200 font-semibold tracking-wider">GESTIÓN</div>
      <button v-for="section in sections.slice(0, 2)" :key="section.key"
        @click="$emit('change-section', section.key)"
        :class="['flex items-center gap-2 px-3 py-2 rounded transition',
          activeSection === section.key ? 'bg-yellow-100/10 text-yellow-200 font-semibold' : 'hover:bg-yellow-100/10 text-yellow-100']">
        <component :is="section.icon" class="w-5 h-5" />
        <span>{{ section.label }}</span>
      </button>
      <div class="my-3 border-t border-yellow-200/30"></div>
      <div class="mb-2 text-xs text-yellow-200 font-semibold tracking-wider">CUENTA</div>
      <div class="flex flex-col gap-2 px-2 py-3 rounded hover:bg-yellow-100/10 transition cursor-pointer text-yellow-100"
        @click="$emit('change-section', 'account')">
        <div class="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="12" cy="10" r="3" />
            <path d="M12 13v4" />
          </svg>
          <div>
            <div class="font-medium text-yellow-100 truncate">{{ userEmail }}</div>
            <div class="text-xs text-yellow-200">Ver perfil / Ajustes</div>
          </div>
        </div>
      </div>
      <div class="my-3 border-t border-yellow-200/30"></div>
      <div class="mb-2 text-xs text-yellow-200 font-semibold tracking-wider">SOPORTE</div>
      <button class="flex items-center gap-2 px-3 py-2 rounded transition hover:bg-yellow-100/10 text-yellow-100">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M18.364 5.636a9 9 0 11-12.728 0M12 3v9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Ayuda
      </button>
      <button class="flex items-center gap-2 px-3 py-2 rounded transition hover:bg-yellow-100/10 text-yellow-100">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 8v4m0 4h.01" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="12" cy="12" r="10" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        Soporte
      </button>
    </nav>
    <div class="px-6 pb-6 mt-auto">
      <button @click="$emit('logout')" class="flex items-center gap-2 w-full px-3 py-2 rounded hover:bg-yellow-100/10 text-yellow-300 transition font-semibold">
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
