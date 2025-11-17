import { createApp as createVueApp, type App } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import PageWrapper from './PageWrapper.vue';
import type { PageContext } from 'vike/types';
import type { Component } from 'vue';
import '../src/main.css';
import 'primeicons/primeicons.css';

export function setupApp(Page: Component, pageContext: PageContext): App {
  const app = createVueApp(PageWrapper, {
    Page,
    pageContext
  });
  const pinia = createPinia();
  app.use(pinia);
  app.provide('pageContext', pageContext);
  
  // Setup PrimeVue 4 with Aura theme
  app.use(PrimeVue, {
    theme: {
      preset: Aura
    }
  });
  
  return app;
}

