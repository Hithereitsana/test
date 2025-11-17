<template>
  <div class="container mx-auto p-6">
    <div class="py-6">
      <h1 class="text-3xl font-bold mb-4">Votre objectif :</h1>
      <p class="mb-4 text-xl">
        Filtrer et afficher une liste d'items en respectant les web standards 
        <a href="/products" class="text-blue-500 underline">sur la page produits</a>.
      </p>
      <p class="mb-4 text-sm text-gray-600">
        Stack: MongoDB • Vike • Vue | Testable via <code>docker compose</code>
      </p>
    </div>
    <div class="space-y-2">
      <Message severity="info">
        <strong>@Todo :</strong>
        <ul class="list-disc list-inside mt-2">
          <li>Développer le endpoint /api/products (pensez aux counts)</li>
          <li>Appliquer les web standards</li>
          <li>Filtrer les items (attention à la réactivité)</li>
          <li>Intégrer une interface minimaliste et élégante (esthétique et surtout fonctionnelle)</li>
        </ul>
      </Message>
      <Message severity="warn">
        <strong>Le test trop simple ?</strong>
        <ul class="list-disc list-inside mt-2">
          <li>Aggregez de nouvelles collections (ex: brands, categories, tags)</li>
          <li>Intégrez des suggestions</li>
          <li>Soyez force de propositions.</li>
        </ul>
      </Message>
    </div>
    <div class="mt-6 rounded-lg">
      <h1 class="text-3xl font-bold mb-4">Livrable :</h1>
      <p class="text-xl">
        Le projet sera testé uniquement via <code class="text-white bg-gray-900 px-2 py-1 rounded-md">docker compose</code>.<br/>
        tips : Veillez aux indexes
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import Message from 'primevue/message';
</script>
