import type { OnCreateAppSync } from "vike-vue/types";
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import type { AppPageContext } from '../src/types/pageContext';
import { hydrateStores } from './hydrateStores';
import '../src/main.css';
import 'primeicons/primeicons.css';

export const onCreateApp: OnCreateAppSync = (pageContext) => {
  const { app } = pageContext;
  const pinia = createPinia();
  app.use(pinia);
  const dataSource = pageContext.data as Partial<AppPageContext> | undefined;
  hydrateStores(dataSource);
  app.use(PrimeVue, {
    theme: {
      preset: Aura
    }
  });
};
