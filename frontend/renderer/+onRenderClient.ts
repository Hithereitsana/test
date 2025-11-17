import type { PageContextClient } from 'vike/types';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import { createApp } from 'vue';
import PageWrapper from './PageWrapper.vue';
import '../src/main.css';
import 'primeicons/primeicons.css';

export { onRenderClient };

async function onRenderClient(pageContext: PageContextClient) {
  const { Page } = pageContext;
  
  // Create app first
  const app = createApp(PageWrapper, {
    Page,
    pageContext
  });
  
  // Setup Pinia BEFORE mounting (but after creating app)
  const pinia = createPinia();
  app.use(pinia);
  
  // Setup PrimeVue 4 with Aura theme
  app.use(PrimeVue, {
    theme: {
      preset: Aura
    }
  });
  
  // Provide pageContext
  app.provide('pageContext', pageContext);
  
  // Mount app - components will be created after Pinia is active
  app.mount('#app');
}

