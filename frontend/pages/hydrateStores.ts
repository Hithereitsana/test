import { useProductIndexesStore } from '../datastore/productIndexes.store';
import { useProductsStore } from '../datastore/products.store';
import { useProductStore } from '../datastore/product.store';
import type { AppPageContext } from '../src/types/pageContext';
export function hydrateStores(dataSource: Partial<AppPageContext> | undefined) {
  if (!dataSource) return;
  const indexesStore = useProductIndexesStore();
  const productsStore = useProductsStore();
  const productStore = useProductStore();
  if (dataSource.indexes !== undefined) {
    indexesStore.hydrate(dataSource.indexes);
  } else {
    indexesStore.hydrate(undefined);
  }
  if (dataSource.products !== undefined) {
    productsStore.hydrate(dataSource.products);
  } else {
    productsStore.hydrate([]);
  }
  if (dataSource.product !== undefined) {
    productStore.hydrate(dataSource.product);
  } else {
    productStore.hydrate(undefined);
  }
}

