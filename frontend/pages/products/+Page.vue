<template>
  <div class="container mx-auto p-6">
    <div v-if="products">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <a :href="`/products/${product._id}`" v-for="product in products" :key="product._id">
          <div class="bg-white rounded-lg shadow-md p-4">
            <div>{{ product.brand }}</div>
            <h3 class="text-lg font-bold">{{ product.name }}</h3>
            <p class="text-sm text-gray-600">{{ product.description }}<br/>{{ product.inStock ? 'En stock' : 'Rupture de stock' }}</p>
            <div class="text-xl text-right w-full">{{ product.price }}€</div>
          </div>
        </a>
      </div>
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