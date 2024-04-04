<script setup>
const runtimeConfig = useRuntimeConfig()
const baseURL = runtimeConfig.app.baseURL
useHead({
  title: 'Stratagem Dojo',
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: `${baseURL}/nuxt.png`,
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

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.list-b-enter-active,
.list-b-leave-active {
  transition: all 0.5s ease;
}
.list-b-enter-from,
.list-b-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>
