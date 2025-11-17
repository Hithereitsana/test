import { defineStore } from 'pinia';
import { ref } from 'vue';
export const useProductIndexesStore = defineStore('productIndexes', () => {
    const indexes = ref<any>();
    function hydrate(data: any) {
        console.log('hydrate', data);
        indexes.value = data;
    }
    async function getIndexes() {
        const res = await fetch(`http://localhost:3000/api/indexes/products`);
        if (!res.ok) {
            throw new Error(`Failed to fetch indexes: ${res.status} ${res.statusText}`);
        }
        const i = await res.json();
        indexes.value = i;
    }
    async function setIndexes() {
        const res = await fetch(`http://localhost:3000/api/indexes/products`, {
            method: 'POST',
            body: JSON.stringify({})
        });
        if (!res.ok) {
            throw new Error(`Failed to set indexes: ${res.status} ${res.statusText}`);
        }
        const i = await res.json();
        indexes.value = i;
    }
    return {
        indexes,
        hydrate,
        getIndexes,
        setIndexes
    };
});