import React from 'react'
import { useMachine } from '@xstate/react'
import { createMemoryGameMachine, GameContext, GameCard } from './memory-game'
import { CardGrid } from './cards/CardGrid'
import { Footer } from './Footer'
import { Card, NoCard, CardBack } from './cards/Card'
import { send } from 'xstate/lib/actionTypes'

const machine = createMemoryGameMachine({
  cards: createCards(6),
  pairs: [],
  firstSelected: null,
  secondSelected: null
})

const App: React.FC = () => {
  const [current, send] = useMachine(machine)

  React.useEffect(() => {
    setInterval(() => send(''), 1000)
  }, [])
  const { firstSelected, secondSelected } = current.context

  const selectCard = (card: GameCard) => {
    const index = current.context.cards.indexOf(card)
    send({ type: 'SELECT', index })
  }

  React.useEffect(() => {
    if (current.value === 'twoSelected') {
      setTimeout(() => {
        send('CONTINUE')
      }, 500)
    }
  }, [current.value])

  return (
    <div>
      <CardGrid>
        {current.context.cards.map(card => {
          const visible = card === firstSelected || card === secondSelected
          return card ? (
            visible ? (
              <Card cardId={card.type} />
            ) : (
              <CardBack onSelect={() => selectCard(card)} />
            )
          ) : (
            <NoCard />
          )
        })}
      </CardGrid>
      <Footer />
    </div>
  )
}

export default App

function randomIndex<T>(arr: T[], except: number[]) {
  if (arr.length <= except.length) {
    throw new Error('array must be longer than exception list')
  }
  let index: number
  let count = 0
  do {
    index = Math.floor(Math.random() * arr.length)
    count++
  } while (except.includes(index) || (arr[index] === null && count < 1000))

  return index
}

function createCards(qty: number): GameCard[] {
  return shuffle(
    Array(qty * 2)
      .fill(0)
      .map((_, i) => ({ type: Math.floor(i / 2) + 1 }))
  )
}

function shuffle<T>(array: readonly T[]): T[] {
  const copy = array.slice()
  const newArray: T[] = []
  while (copy.length > 0) {
    const randomIndex = Math.floor(Math.random() * copy.length)
    const removedItems = copy.splice(randomIndex, 1)
    newArray.push(removedItems[0])
  }
  return newArray
}
