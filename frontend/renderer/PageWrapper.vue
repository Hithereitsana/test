<template>
  <component :is="Layout" v-if="Layout">
    <component :is="Page" />
  </component>
  <component :is="Page" v-else />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Component } from 'vue';
import type { PageContext } from 'vike/types';

const props = defineProps<{
  Page: Component;
  pageContext: PageContext;
}>();

const Layout = computed(() => {
  const config = props.pageContext.config as any;
  const layout = config?.Layout as Component | undefined;
  return layout;
});
</script>

