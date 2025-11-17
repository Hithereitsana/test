<template>
  <header class="sticky top-0 z-10 bg-white shadow-md flex gap-2 w-full p-2 items-center">
    <a href="/products" v-if="pageContext.routeParams.id">
      <i class="pi pi-chevron-left"></i>
    </a>
    <a href="/" v-else>
      <i class="pi pi-home"></i>
    </a>
    <div class="flex-1 justify-center items-center text-center">
      <InputText id="username" v-model="search" aria-describedby="username-help" placeholder="Rechercher un produit"/>
    </div>
    <div>
      <Button @click="show = !show" severity="primary" :icon="show ? 'pi pi-filter-slash' : 'pi pi-filter'" label="Filtrer"></Button>
    </div>
  </header>
  <div>
    <slot />
  </div>
  <Drawer v-model:visible="show" position="right" header="Filtres">
    <div>
      <Message>@TODO : Afficher les facettes et filtrer les produits ici</Message>
    </div>
  </Drawer>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useProductsStore } from "../datastore/products.store";
import { Drawer, Button, InputText, Message } from "primevue";
import { usePageContext } from "vike-vue/usePageContext";
const pageContext = usePageContext();
const productsStore = useProductsStore();
const show = ref(false);
const search = ref('');
watch(search, (newVal) => {
  productsStore.search(newVal);
});
</script>