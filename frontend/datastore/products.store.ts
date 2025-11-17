import { defineStore } from 'pinia';
import type { Product, Facets, Pagination, ProductFilters } from '../src/types/product';
import { ref, watch } from 'vue';
export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([]);
  const facets = ref<Facets>({
    categories: {},
    brands: {},
    priceRange: { min: 0, max: 0 },
    availability: { inStock: 0, outOfStock: 0 }
  });
  const pagination = ref<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const filters = ref<ProductFilters>({
    search: '',
    category: [],
    brand: [],
    priceMin: null,
    priceMax: null,
    inStock: null
  });
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  function setProducts(data?: Product[]) {
    products.value = data ?? [];
  }
  function setFilters(newFilters: Partial<ProductFilters>) {
    filters.value = { ...filters.value, ...newFilters };
  }
  async function search(newSearch: string) {
    filters.value.search = newSearch;
    const params = new URLSearchParams();
    if (newSearch) params.set('search', newSearch);
    else params.delete('search');
    const newUrl = `/products${params.toString() ? `?${params.toString()}` : ''}`;
    if (!import.meta.env.SSR) {
      const { navigate } = await import('vike/client/router');
      await navigate(newUrl);
    }
  }
  function resetFilters() {
    filters.value = {
      search: '',
      category: [],
      brand: [],
      priceMin: null,
      priceMax: null,
      inStock: null
    };
  }

  return {
    products,
    facets,
    pagination,
    filters,
    loading,
    error,
    setProducts,
    setFilters,
    resetFilters,
    search
  };
});