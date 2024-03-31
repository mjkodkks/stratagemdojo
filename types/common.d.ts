import type { ImageType } from './icons'

export interface HD2StratagemsData {
  id: number
  name: string
  sequence: string
  image: ImageType
  groupId: GroupStratagemId
  group: string
}

export interface StratagemsData extends HD2StratagemsData {
  isActive: boolean
}
export type Stage = 'setup' | 'training'

export interface GroupStratagemsList {
  groupId: GroupStratagemId
  group: GroupStratagem
  stratagems: StratagemsData[]
}

export type GroupStratagemId = 'general_stratagems'
  | 'patriotic_administration_center'
  | 'orbital_cannons'
  | 'hangar'
  | 'bridge'
  | 'engineering_bay'
  | 'robotics_workshop'

export type GroupStratagem = 'General Stratagems'
  | 'Patriotic Administration Center'
  | 'Orbital Cannons'
  | 'Hangar'
  | 'Bridge'
  | 'Engineering Bay'
  | 'Robotics Workshop'

export type KeyState = 'default' | 'active' | 'inactive'
export interface SequencesData {
  id: number
  keyName: string
  keyState: KeyState
}

export interface KeyBinding {
  up: string
  down: string
  left: string
  right: string
}
