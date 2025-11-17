import { defineStore } from 'pinia';
import type { Product } from '../src/types/product';
import { ref } from 'vue';
export const useProductStore = defineStore('product', () => {
  const product = ref<Product>();
  function setProduct(data?: Product) {
    product.value = data;
  }
  return {
    product,
    setProduct
  };
});