<!-- eslint-disable ts/no-use-before-define -->
<script setup lang="ts">
import { onKeyStroke } from '@vueuse/core'
import HD2Sequences from '~/assets/HD2-Sequences'
import type { GroupStratagemsList, HD2StratagemsData, SequencesData, Stage, StratagemsData } from '~/types/common'

const runtimeConfig = useRuntimeConfig()
const baseURL = runtimeConfig.app.baseURL

const stratagems = ref<StratagemsData[]>(buildStratagemList(HD2Sequences))
const stratagemsPlayable = ref<StratagemsData[]>([])

function buildStratagemList(_HD2Sequences: HD2StratagemsData[]): StratagemsData[] {
  const newData = _HD2Sequences.map((m, _i) => {
    return {
      ...m,
      isActive: false,
    }
  }) as unknown as StratagemsData[]
  return newData
}

const generalStratagems = computed(() => stratagems.value.filter(f => f.groupId === 'general_stratagems'))
const patrioticStratagems = computed(() => stratagems.value.filter(f => f.groupId === 'patriotic_administration_center'))
const orbitalStratagems = computed(() => stratagems.value.filter(f => f.groupId === 'orbital_cannons'))
const hangarStratagems = computed(() => stratagems.value.filter(f => f.groupId === 'hangar'))
const bridgeStratagems = computed(() => stratagems.value.filter(f => f.groupId === 'bridge'))
const engineeringStratagems = computed(() => stratagems.value.filter(f => f.groupId === 'engineering_bay'))
const roboticsStratagems = computed(() => stratagems.value.filter(f => f.groupId === 'robotics_workshop'))

const groupStratagems = ref<GroupStratagemsList[]>(buildGroupStratagemsList())

function buildGroupStratagemsList(): GroupStratagemsList[] {
  return [
    {
      group: 'General Stratagems',
      groupId: 'general_stratagems',
      stratagems: generalStratagems.value,
    },
    {
      group: 'Patriotic Administration Center',
      groupId: 'patriotic_administration_center',
      stratagems: patrioticStratagems.value,
    },
    {
      group: 'Orbital Cannons',
      groupId: 'orbital_cannons',
      stratagems: orbitalStratagems.value,
    },
    {
      group: 'Hangar',
      groupId: 'hangar',
      stratagems: hangarStratagems.value,
    },
    {
      group: 'Bridge',
      groupId: 'bridge',
      stratagems: bridgeStratagems.value,
    },
    {
      group: 'Engineering Bay',
      groupId: 'engineering_bay',
      stratagems: engineeringStratagems.value,
    },
    {
      group: 'Robotics Workshop',
      groupId: 'robotics_workshop',
      stratagems: roboticsStratagems.value,
    },
  ]
}

const selectedStratagem = ref<StratagemsData[]>([])
function toggleStratagem(stratagem: StratagemsData) {
  stratagem.isActive = !stratagem.isActive
  if (selectedStratagem.value.filter(f => f.id === stratagem.id).length > 0) {
    selectedStratagem.value = selectedStratagem.value.filter(f => f.id !== stratagem.id)
  }
  else {
    selectedStratagem.value = [...selectedStratagem.value, stratagem]
  }
  stratagemsPlayable.value = selectedStratagem.value

  setupStage()
}

const firstSelectedStratageName = computed(() => stratagemsPlayable.value.length > 0 && stratagemsPlayable.value[0]?.name || '')

function clearAllStratagems() {
  selectedStratagem.value = []
  stratagemsPlayable.value = []
  currentKeyList.value = []
  stage.value = 'setup'

  const copyArr = JSON.parse(JSON.stringify(buildStratagemList(HD2Sequences)))
  stratagems.value = copyArr
  groupStratagems.value = buildGroupStratagemsList()
}

// on start training
const currentMove = ref<string>('')
// const currentStratagemMoveIndex = ref<number>(0)
const currentKeyMoveIndex = ref<number>(0)
const currentKeyList = ref<SequencesData[]>([])
const stage = ref<Stage>('setup')
const arrowBinding = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
const keyBinding = ref({
  up: 'KeyW',
  down: 'KeyS',
  left: 'KeyA',
  right: 'KeyD',
})
const pressAudioRef = ref<HTMLAudioElement | null>(null)
const finishAudioRef = ref<HTMLAudioElement | null>(null)

function mapKeyStore(key: string) {
  const isArrow = arrowBinding.includes(key)
  const template = {
    U: isArrow ? arrowBinding[0] : keyBinding.value.up,
    D: isArrow ? arrowBinding[1] : keyBinding.value.down,
    L: isArrow ? arrowBinding[2] : keyBinding.value.left,
    R: isArrow ? arrowBinding[3] : keyBinding.value.right,
  } as { [x: string]: string }
  return template[key] || key
}

onKeyStroke((e) => {
  e.preventDefault()
  if (![keyBinding.value.up, keyBinding.value.down, keyBinding.value.left, keyBinding.value.right, arrowBinding[0], arrowBinding[1], arrowBinding[2], arrowBinding[3]].includes(e.code)) {
    return
  }
  // console.log(e)
  if (stratagemsPlayable.value.length <= 0) {
    return
  }

  const key = currentKeyList.value[currentKeyMoveIndex.value]
  const isMatch = key.keyName === e.code

  if (!isMatch) {
    currentKeyMoveIndex.value = 0
    currentKeyList.value = currentKeyList.value.map(k => ({ ...k, keyState: 'default' }))
    return
  }

  startMeasureStat()

  currentMove.value = e.code
  key.keyState = 'active'
  if (pressAudioRef.value) {
    pressAudioRef.value.currentTime = 0
    pressAudioRef.value.play()
  }

  if (currentKeyMoveIndex.value === currentKeyList.value.length - 1) {
    endMeasureStat()
    stratagemsPlayable.value.shift()
    currentKeyMoveIndex.value = 0

    if (finishAudioRef.value) {
      finishAudioRef.value.currentTime = 0
      finishAudioRef.value.play()
    }

    if (stratagemsPlayable.value.length < 1) {
      clearAllStratagems()

      // alert('Training Complete!')
    }
    const firstStratagemsPlayable = stratagemsPlayable.value.length > 0 && stratagemsPlayable.value.at(0)
    if (firstStratagemsPlayable) {
      currentKeyList.value = firstStratagemsPlayable.sequence.split('').map((k, i) => ({
        id: i,
        keyName: mapKeyStore(k),
        keyState: 'default',
      }))
    }
  }
  else {
    currentKeyMoveIndex.value++
  }
})

function resetStage() {
  currentKeyMoveIndex.value = 0
  currentKeyList.value = []
}
function setupStage() {
  resetStage()
  currentKeyList.value = stratagemsPlayable.value[0].sequence.split('').map((m, i) => {
    return {
      id: i,
      keyName: mapKeyStore(m),
      keyState: 'default',
    }
  })
}

const startMark = ref(0)
const endMark = ref(0)
const colectionMeasureTime = ref<{ stratagemName: string, time: number, createdAt: string }[]>([])
function startMeasureStat() {
  if (startMark.value === 0) {
    startMark.value = new Date().getTime()
  }
}

function endMeasureStat() {
  endMark.value = new Date().getTime()
  const template = {
    stratagemName: stratagemsPlayable.value[0].name,
    time: (endMark.value - startMark.value) / 1000,
    createdAt: new Date().toLocaleString(),
  }
  colectionMeasureTime.value = [...colectionMeasureTime.value, template]
  startMark.value = 0
  endMark.value = 0
}
</script>

<template>
  <div class="stage flex">
    <div class="w-[356px] h-dvh overflow-auto flex flex-col gap-4">
      <button @click="clearAllStratagems()">
        Clear
      </button>
      <div v-for="group in groupStratagems" :key="group.groupId">
        <h1 class="font-bold text-xl ml-2">
          {{ group.group }}
        </h1>
        <div class="grid gap-0 gap-y-2 grid-cols-4 justify-center items-center justify-items-center w-full mt-2">
          <StratagemIcon
            v-for="stratagem in group.stratagems" :key="stratagem.name"
            width="64px"
            height="64px"
            :icon-name="stratagem.image"
            :root-icon="`${baseURL}/data/images/stratagem_icons/`"
            class="transition-all trasnitionanimation-duration-150 cursor-pointer" :class="[stratagem.isActive ? 'outline outline-2' : '']"
            @click="toggleStratagem(stratagem)"
          />
        </div>
      </div>
    </div>
    <div class="flex-1 flex flex-col justify-center items-center relative">
      <InfoBar class="absolute right-4 top-4" />
      <TransitionGroup name="list" tag="div" class="w-full flex justify-center min-h-[150px] gap-4">
        <StratagemIcon
          v-for="stratagem in stratagemsPlayable" :key="stratagem.name"
          :icon-name="stratagem.image" width="150px"
          :root-icon="`${baseURL}/data/images/stratagem_icons/`"
          class="first:ring-offset-2 first:ring-2 first:ring-primary first:border-primary transition-all trasnitionanimation-duration-150"
          height="auto"
        />
      </TransitionGroup>
      <div class="w-full h-10 bg-primary mt-4 flex justify-center items-center">
        <span class="text-2xl text-black font-bold">{{ firstSelectedStratageName }}</span>
      </div>
      <div class="w-full flex justify-center items-center mt-4 min-h-20">
        <!-- <button @click="clearStratagemPlay()">
          clearStratagemPlay
        </button> -->
        <ArrowJoystick :movement-list-setup="currentKeyList" :key-binding="keyBinding" />
        <audio v-show="false" ref="pressAudioRef" :src="`${baseURL}/data/sounds/press.mp3`" />
        <audio v-show="false" ref="finishAudioRef" :src="`${baseURL}/data/sounds/finishMove.mp3`" />
      </div>
      <div class="w-full h-10 bg-primary mt-4" />
      <button v-if="colectionMeasureTime && colectionMeasureTime.length > 0" @click="colectionMeasureTime = []">
        X Clear
      </button>
      <div class="w-[400px] h-[260px] overflow-auto mt-4">
        <TransitionGroup name="list-b" tag="ul" class="flex flex-col-reverse text-xs">
          <li
            v-for="(mesureItem, i) in colectionMeasureTime" :key="`${mesureItem.createdAt}_${i}`"
            class="flex"
          >
            <div class="w-2/5 text-primary text-center">
              {{ mesureItem.stratagemName }}
            </div>
            <div class="w-1/5 text-center">
              {{ mesureItem.time }} Sec
            </div>
            <div class="w-2/5 text-center">
              {{ mesureItem.createdAt }}
            </div>
          </li>
        </TransitionGroup>
      </div>
      <!-- <div class="w-[360px] h-[260px] overflow-auto mt-4">
        <a class="twitter-timeline" href="https://twitter.com/helldivers2?ref_src=twsrc%5Etfw">Tweets by helldivers2</a>
      </div> -->
      <!-- <ArrowJoystick movement-list-setup="URLD" /> -->
    </div>
  </div>
</template>
