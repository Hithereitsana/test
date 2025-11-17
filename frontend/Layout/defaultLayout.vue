<template>
  <header class="sticky top-0 z-10 bg-white shadow-md flex gap-2 w-full p-2 items-center">
    <h1 class="font-bold text-2xl">TenderCrunch</h1>
  </header>
  <div>
    <slot />
  </div>
</template>

<script setup lang="ts">
// L'hydratation des stores est gérée dans +onCreateApp.ts
</script>