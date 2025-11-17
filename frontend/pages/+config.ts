import vikeVue from "vike-vue/config";
import type { Config } from "vike/types";
export default {
  title: "TenderCrunch Test technique",
  description: "test technique frontend",
  passToClient: ["user"],
  clientRouting: true,
  hydrationCanBeAborted: true,
  extends: [vikeVue as typeof vikeVue],
  meta: {
    dataEndpointUrl: {
      env: {
        server: true,
        client: false
      }
    },
  },
} satisfies Config;
