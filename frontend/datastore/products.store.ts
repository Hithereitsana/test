import { defineStore } from 'pinia';
import type { Product, Facets, Pagination, ProductFilters } from '../src/types/product';
import { ref, watch } from 'vue';
export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>([]);
  // Données d'exemple par défaut dans les facets (à remplacer par les vraies facettes de l'API)
  const facets = ref<Facets>({
    categories: {
      'Électronique': 1250,
      'Vêtements': 980,
      'Maison & Jardin': 750,
      'Sport & Loisirs': 620,
      'Livres': 540,
      'Jouets': 480,
      'Beauté & Santé': 420,
      'Automobile': 380,
      'Alimentation': 350,
      'Bricolage': 320,
      'Informatique': 280,
      'Musique': 250,
      'Photo & Vidéo': 220,
      'Jardinage': 200
    },
    brands: {
      'TechCorp': 450,
      'FashionBrand': 380,
      'HomeStyle': 320,
      'SportPro': 290,
      'BookWorld': 260,
      'ToyLand': 240,
      'BeautyPlus': 210,
      'AutoMax': 190,
      'FoodFresh': 170,
      'BuildIt': 150,
      'CompTech': 140,
      'MusicHub': 130,
      'PhotoPro': 120,
      'GardenLife': 110,
      'EcoBrand': 100,
      'PremiumLine': 95,
      'BasicGoods': 90,
      'SmartHome': 85,
      'FitLife': 80,
      'StyleCo': 75
    },
    tags: {
      'nouveau': 320,
      'populaire': 280,
      'bestseller': 250,
      'promo': 220,
      'exclusif': 190,
      'premium': 170,
      'deluxe': 150,
      'standard': 130,
      'basique': 110,
      'éco-friendly': 95,
      'durable': 85,
      'innovant': 75,
      'classique': 65,
      'moderne': 55,
      'vintage': 45
    },
    priceRange: { min: 0, max: 2000 },
    availability: { inStock: 8500, outOfStock: 1500 }
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

  function hydrate(data?: Product[]) {
    products.value = data ?? [];
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
    hydrate,
    setFacets,
    setFilters,
    resetFilters,
    search
  };
});