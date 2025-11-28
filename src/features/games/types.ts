import type { ComponentType } from 'react'

export type GameDifficulty = 'Cozy' | 'Chill' | 'Spicy'
export type GameCategory =
  | 'ritual'
  | 'memory'
  | 'puzzle'
  | 'creative'
  | 'story'
  | 'calm'
  | 'logic'
  | 'micro'
  | 'speed'

export type MiniGameResolverKey =
  | 'starlight-connect'
  | 'compliment-crafter'
  | 'emoji-forage'
  | 'harmony-sum'
  | 'story-spark'

export type GameDefinition = {
  id: string
  title: string
  summary: string
  icon: string
  category: GameCategory
  difficulty: GameDifficulty
  duration: string
  accent: 'lavender' | 'mint' | 'blush' | 'ink'
  resolver: MiniGameResolverKey
  tags: string[]
}

export type MiniGameProps = {
  game: GameDefinition
  onWin: () => void
}

export type MiniGameComponent = ComponentType<MiniGameProps>
