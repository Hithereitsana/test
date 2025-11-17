<template>
    <div>
        this is a product item {{ id }}
    </div>
    <pre>{{ product }}</pre>
</template>

<script setup lang="ts">
import { useData } from "vike-vue/useData";
import { usePageContext } from "vike-vue/usePageContext";
import type { AppPageContext } from "../../../src/types/pageContext";
const data: AppPageContext = useData();
const pageContext = usePageContext();
const id = pageContext.routeParams.id;
const { product } = data;
</script>