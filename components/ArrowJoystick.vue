<script lang="ts" setup>
import type { KeyBinding, SequencesData } from '~/types/common'

interface Props {
  movementListSetup: SequencesData[]
  keyBinding: KeyBinding
}
const props = defineProps<Props>()

const arrowList = [
  {
    name: props.keyBinding.up,
    alternateKey: 'ArrowUp',
    activeClass: 'text-primary',
    baseClass: '',
    defaultClass: 'white',
  },
  {
    name: props.keyBinding.down,
    alternateKey: 'ArrowDown',
    activeClass: 'text-primary',
    baseClass: 'rotate-180',
    defaultClass: 'white',
  },
  {
    name: props.keyBinding.left,
    alternateKey: 'ArrowLeft',
    activeClass: 'text-primary',
    baseClass: '-rotate-90',
    defaultClass: 'white',
  },
  {
    name: props.keyBinding.right,
    alternateKey: 'ArrowRight',
    activeClass: 'text-primary',
    baseClass: 'rotate-90',
    defaultClass: 'white',
  },
]
</script>

<template>
  <div class="flex gap-2">
    <div v-for="(movement, index) in movementListSetup" :key="index">
      <template v-for="arrow in arrowList" :key="arrow.name">
        <IconArrow
          v-if="movement.keyName === arrow.name || movement.keyName === arrow.alternateKey"
          :key="arrow.name"
          class="w-8 h-8"
          :class="[arrow.baseClass, movement.keyState === 'active' ? arrow.activeClass : arrow.defaultClass]" :name="arrow.name"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>

</style>
