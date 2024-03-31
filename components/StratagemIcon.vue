<script lang="ts" setup>
import type { ImageType } from '@/types/icons'

interface Props {
  iconName?: ImageType
  rootIcon?: string
  width?: string
  height?: string
}
withDefaults(defineProps<Props>(), {
  iconName: 'anti-materiel_rifle.svg',
  rootIcon: '/data/images/Stratagem_Icons/',
  width: '16px',
  height: '16px',
})
function getImageUrl(rootIcon: string, iconName: string) {
  return new URL(`${rootIcon}${iconName}`, import.meta.url).href
}
</script>

<template>
  <div class="border-blue-300 border" :style="{ width, height }">
    <img :src="getImageUrl(rootIcon, iconName)" :alt="getImageUrl('/data/images/', 'helldivers2Icon.jpeg')" width="100%" height="100%" lazy>
  </div>
</template>

<style scoped>

</style>
