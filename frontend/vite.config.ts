import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vike from 'vike/plugin';

export default defineConfig({
  plugins: [vue(), vike()],
  server: {
    host: '0.0.0.0',
    port: 5173
  },
  resolve: {
    alias: {
      'vike-vue/config': 'vike-vue/dist/+config.js'
    }
  }
});


