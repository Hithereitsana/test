import { defineStore } from 'pinia';
import type {
  Product,
  Facets,
  Pagination,
  ProductFilters,
  ProductsResponse, // ANAIS: on utilise maintenant aussi la réponse complète de l'API
} from '../src/types/product';
import { ref, watch } from 'vue';

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([]);
  // Données d'exemple par défaut dans les facets (à remplacer par les vraies facettes de l'API)
  const facets = ref<Facets>({
    categories: {},
    brands: {},     
    tags: {},       
    priceRange: { min: 0, max: 0 }, 
    availability: { inStock: 0, outOfStock: 0 }, 
  });

  const pagination = ref<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const filters = ref<ProductFilters>({
    search: '',
    category: [],
    brand: [],
    priceMin: null,
    priceMax: null,
    inStock: null,
  });

  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  function hydrate(data?: Product[] | ProductsResponse) { // ANAIS: accepte soit Product[], soit ProductsResponse
    if (!data) {
      products.value = []; // reset si aucune donnée
      return; 
    }

    if (Array.isArray(data)) {
      // ANAIS: compatibilité avec l'ancien comportement (tableau brut de produits)
      products.value = data;
      return;
    }

    // ANAIS:on hydrate à partir de la réponse complète de l'API
    products.value = data.products;
    pagination.value = data.pagination;
    facets.value = {
      ...facets.value,
      ...data.facets,
    };
  }

  function setFacets(newFacets?: Partial<Facets>) {
    if (newFacets) {
      facets.value = { ...facets.value, ...newFacets };
    }
  }

  function setFilters(newFilters: Partial<ProductFilters>) {
    filters.value = { ...filters.value, ...newFilters };
  }

  /* 
  @todo
  exemple de search params de préférence à supprimer : 
  utilisez l'object filters pour appliquer les query params 
  */
  async function search(newSearch: string) {
    filters.value.search = newSearch;
    const params = new URLSearchParams(window.location.search); // on part des query params existants
    if (newSearch) params.set('search', newSearch);
    else params.delete('search');
    params.delete('page'); // ANAIS: quand on change la recherche, on revient à la page 1
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
      inStock: null,
    };
  }

  async function goToPage(page: number, limit?: number) { //  action dédiée à la pagination côté backend
    const params = new URLSearchParams(window.location.search);
    if (page > 1) params.set('page', String(page));
    else params.delete('page');
    if (limit) params.set('limit', String(limit));
    const newUrl = `/products${params.toString() ? `?${params.toString()}` : ''}`;
    if (!import.meta.env.SSR) {
      const { navigate } = await import('vike/client/router');
      await navigate(newUrl);
    }
  }

  return {
    products,
    facets,
    pagination,
    filters,
    loading,
    error,
    hydrate,
    setFacets,
    setFilters,
    resetFilters,
    search,
    goToPage, // ANAIS: exposer l'action de pagination pour les composants
  };
});
