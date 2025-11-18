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
      <Button @click="show = !show" severity="primary" :icon="show ? 'pi pi-filter-slash' : 'pi pi-filter'"
        label="Filtrer"></Button>
    </div>
  </header>
  <div>
    <slot />
  </div>
  <Drawer v-model:visible="show" position="right" header="Filtres">
    <div classs="space-y-4">
      <Message class="mb-4">@TODO : Afficher les facettes et filtrer les produits ici, voici quelques composants utiles pour vous
        faire gagner du temps avec primevue :</Message>
      <div class="space-y-4">
        <h2>Price</h2>
        <div class="px-4">
          <Slider v-model="value" range class="w-full" :min="0" :max="200"/>
        </div>
        <h2>Availability</h2>
        <div class="flex items-center gap-2">
          <ToggleSwitch></ToggleSwitch>
          <label>In Stock</label>
        </div>
        <div class="flex items-center gap-2">
          <ToggleSwitch></ToggleSwitch>
          <label>Sold out</label>
        </div>
        <h2>Categories</h2>
        <Select v-model="filters.categories" 
          :options="categories" 
          optionLabel="name" 
          placeholder="Select categories filter"
          multiple
          class="w-full">
          <template #value="slotProps">
            <div v-if="slotProps.value" class="flex items-center">
              <div>{{ slotProps.value.name }}</div>
            </div>
            <span v-else>
              {{ slotProps.placeholder }}
            </span>
          </template>
          <template #option="slotProps">
            <div class="flex items-center">
              <div>{{ slotProps.option.name }}</div>
            </div>
          </template>
          <template #dropdownicon>
            <i class="pi pi-list" />
          </template>
        </Select>
        <h2>Brands</h2>
        <Select v-model="filters.tags" 
          :options="tags" 
          optionLabel="name" 
          placeholder="Select tags filter"
          multiple
          class="w-full">
          <template #value="slotProps">
            <div v-if="slotProps.value" class="flex items-center">
              <div>{{ slotProps.value.name }}</div>
            </div>
            <span v-else>
              {{ slotProps.placeholder }}
            </span>
          </template>
          <template #option="slotProps">
            <div class="flex items-center">
              <div>{{ slotProps.option.name }}</div>
            </div>
          </template>
          <template #dropdownicon>
            <i class="pi pi-bookmark" />
          </template>
        </Select>
        <h2>Tags</h2>
        <Select v-model="filters.tags" 
          :options="tags" 
          optionLabel="name" 
          placeholder="Select tags filter"
          multiple
          class="w-full">
          <template #value="slotProps">
            <div v-if="slotProps.value" class="flex items-center">
              <div>{{ slotProps.value.name }}</div>
            </div>
            <span v-else>
              {{ slotProps.placeholder }}
            </span>
          </template>
          <template #option="slotProps">
            <div class="flex items-center">
              <div>{{ slotProps.option.name }}</div>
            </div>
          </template>
          <template #dropdownicon>
            <i class="pi pi-tags" />
          </template>
        </Select>
      </div>
    </div>
  </Drawer>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useProductsStore } from "../datastore/products.store";
import { Drawer, Button, InputText, Message, Select, ToggleSwitch, Slider } from "primevue";
import { usePageContext } from "vike-vue/usePageContext";
import { storeToRefs } from "pinia";
const pageContext = usePageContext();
const productsStore = useProductsStore();
const show = ref(false);
const search = ref('');
const {filters} = storeToRefs(productsStore);

// exemple search (à supprimer) livesync filters de préférence
watch(search, (newVal) => {
  productsStore.search(newVal);
});
</script>