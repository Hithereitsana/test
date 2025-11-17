<template>
  <div class="container mx-auto p-6">
    <div v-if="products">
      <pre>{{ products }}</pre>
    </div>
    <div v-else>
      <p>Chargement des produits...</p>
    </div>
      <div class="sticky bottom-0 z-10 bg-white border-t shadow-lg p-4">
        <Paginator :totalRecords="products.length" :rows="10" :rowsPerPageOptions="[10, 20, 50]" />
      </div>
  </div>
</template>

<script setup lang="ts">
import { useProductsStore } from '../../datastore/products.store';
import { storeToRefs } from 'pinia';
const productsStore = useProductsStore();
const { products } = storeToRefs(productsStore);
import Paginator from 'primevue/paginator';
</script>

<style scoped>
</style>