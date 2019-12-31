import { GameCard } from './memory-game'

export function createCards(qty: number): GameCard[] {
  return Array(qty * 2)
    .fill(0)
    .map((_, i) => createCard(Math.floor(i / 2) + 1))
}

function createCard(type: number): GameCard {
  return { type, collected: false }
}

////

export function shuffle<T>(array: readonly T[]): T[] {
  const copy = array.slice()
  const newArray: T[] = []
  while (copy.length > 0) {
    const randomIndex = Math.floor(Math.random() * copy.length)
    const removedItems = copy.splice(randomIndex, 1)
    newArray.push(removedItems[0])
  }
  return newArray
}
