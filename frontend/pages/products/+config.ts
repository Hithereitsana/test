//import vikeVue from "vike-vue/config";
import type { Config } from "vike/types";
import Layout from "../../Layout/productsLayout.vue";
export default {
  Layout,
  title: "Liste des produits",
  description: "liste des produits",
  passToClient: ["user", 'initialState'],
  clientRouting: true,
  hydrationCanBeAborted: true,
 //extends: [vikeVue as typeof vikeVue],
  meta: {
    dataEndpointUrl: {
      env: {
        server: true,
        client: false
      }
    },
  },
} satisfies Config;
