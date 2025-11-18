<template>
  <header class="sticky top-0 z-10 bg-white shadow-md flex gap-2 w-full p-2 items-center">
    <a href="/products" v-if="pageContext.routeParams.id">
      <i class="pi pi-chevron-left"></i>
    </a>
    <a href="/" v-else>
      <i class="pi pi-home"></i>
    </a>
    <div class="flex-1 justify-center items-center text-center">
      <InputText id="username" v-model="search" aria-describedby="username-help" placeholder="Rechercher un produit" />
    </div>
    <div>
      <button @click="show = !show">
        <i class="pi pi-filter"></i>
      </button>
    </div>
  </header>
  <div>
    <slot />
  </div>
  <Drawer v-model:visible="show" position="right" header="Filtres">
    <div class="space-y-4">
      <Message class="mb-4">@TODO : Afficher les facettes et filtrer les produits ici, voici quelques composants utiles pour vous
        faire gagner du temps avec primevue :</Message>
      <div class="space-y-4">
        <h2 class="font-semibold text-lg">Price</h2>
        <div class="px-4">
          <Slider 
            v-model="priceRange" 
            range 
            class="w-full" 
            :min="facets.priceRange.min" 
            :max="facets.priceRange.max" />
          <div class="flex justify-between text-sm text-gray-600 mt-2">
            <span>{{ priceRange[0] }}€</span>
            <span>{{ priceRange[1] }}€</span>
          </div>
        </div>
        <h2 class="font-semibold text-lg">Availability</h2>
        <div class="flex items-center gap-2">
          <ToggleSwitch v-model="inStockOnly" />
          <label>In Stock ({{ facets.availability.inStock }})</label>
        </div>
        <div class="flex items-center gap-2">
          <ToggleSwitch v-model="outOfStockOnly" />
          <label>Sold out ({{ facets.availability.outOfStock }})</label>
        </div>
        <h2 class="font-semibold text-lg">Categories</h2>
        <MultiSelect 
          v-model="selectedCategories" 
          :options="categories" 
          optionLabel="name" 
          placeholder="Select categories filter"
          class="w-full"
          display="chip"
          :showToggleAll="true"
          :filter="true">
          <template #option="slotProps">
            <div class="flex items-center justify-between w-full">
              <div class="flex items-center gap-2">
                <span>{{ slotProps.option.name }}</span>
              </div>
              <span class="text-sm text-gray-500">({{ slotProps.option.count }})</span>
            </div>
          </template>
        </MultiSelect>
        <h2 class="font-semibold text-lg">Brands</h2>
        <MultiSelect 
          v-model="selectedBrands" 
          :options="brands" 
          optionLabel="name" 
          placeholder="Select brands filter"
          class="w-full"
          display="chip"
          :showToggleAll="true"
          :filter="true">
          <template #option="slotProps">
            <div class="flex items-center justify-between w-full">
              <div class="flex items-center gap-2">
                <span>{{ slotProps.option.name }}</span>
              </div>
              <span class="text-sm text-gray-500">({{ slotProps.option.count }})</span>
            </div>
          </template>
        </MultiSelect>
        <h2 class="font-semibold text-lg">Tags</h2>
        <MultiSelect 
          v-model="selectedTags" 
          :options="tags" 
          optionLabel="name" 
          placeholder="Select tags filter"
          class="w-full"
          display="chip"
          :showToggleAll="true"
          :filter="true">
          <template #option="slotProps">
            <div class="flex items-center justify-between w-full">
              <div class="flex items-center gap-2">
                <span>{{ slotProps.option.name }}</span>
              </div>
              <span class="text-sm text-gray-500">({{ slotProps.option.count }})</span>
            </div>
          </template>
        </MultiSelect>
      </div>
    </div>
  </Drawer>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useProductsStore } from "../datastore/products.store";
import { Drawer, Button, InputText, Message, MultiSelect, Checkbox, ToggleSwitch, Slider } from "primevue";
import { usePageContext } from "vike-vue/usePageContext";
import { storeToRefs } from "pinia";

const pageContext = usePageContext();
const productsStore = useProductsStore();
const show = ref(false);
const search = ref('');
const { filters, facets } = storeToRefs(productsStore);

// Convertir les facets en format pour les selects
const categories = computed(() => 
  Object.entries(facets.value.categories).map(([name, count]) => ({ name, count }))
);
const brands = computed(() => 
  Object.entries(facets.value.brands).map(([name, count]) => ({ name, count }))
);
const tags = computed(() => 
  facets.value.tags ? Object.entries(facets.value.tags).map(([name, count]) => ({ name, count })) : []
);

// Bindings pour les filtres - initialisés depuis les facets
const priceRange = ref([facets.value.priceRange.min, facets.value.priceRange.max]);
const inStockOnly = ref(false);
const outOfStockOnly = ref(false);
const selectedCategories = ref([]);
const selectedBrands = ref([]);
const selectedTags = ref([]);

// Synchroniser les filtres avec le store
watch(search, (newVal) => {
  productsStore.search(newVal);
});

// Helpers pour vérifier si une option est sélectionnée (pour les checkboxes)
const isCategorySelected = (option: any) => {
  return selectedCategories.value.some((c: any) => c.name === option.name);
};

const isBrandSelected = (option: any) => {
  return selectedBrands.value.some((b: any) => b.name === option.name);
};

const isTagSelected = (option: any) => {
  return selectedTags.value.some((t: any) => t.name === option.name);
};
</script>