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
  | 'slide-puzzle'
  | 'color-match'
  | 'line-connect'
  | 'number-swap'
  | 'path-finder'
  | 'merge-tiles'
  | 'rotate-tiles'
  | 'tic-tac-toe'
  | 'connect-four'
  | 'rock-paper-scissors'
  | 'checkers-lite'
  | 'dots-and-boxes'
  | 'memory-flip'
  | 'emoji-match'
  | 'sequence-repeat'
  | 'fast-recall'

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
