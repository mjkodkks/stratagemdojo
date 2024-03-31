<script setup>
useHead({
  title: 'Nuxt 3 Vitesse DKKs',
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/nuxt.png',
    },
  ],
})
</script>

<template>
  <div id="app">
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
html, body , #__nuxt{
  margin: 0;
  padding: 0;
  height: 100%;
}

#app, main {
  height: inherit;
}

html.dark {
  background: var(--background-color);
  color: white;
}
</style>
