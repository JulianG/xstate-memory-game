import React from 'react'
import { useMachine } from '@xstate/react'
import { createMemoryGameMachine, GameCard } from './memory-game'
import { CardGrid, Card, CollectedCard, CardBack, NoCard } from './cards/Card'
import { Footer } from './Footer'
import { createCards, shuffle } from './factory'

const numCards = Number.parseInt(window.location.pathname.substr(1)) || 12

const machine = createMemoryGameMachine({
  cards: shuffle(createCards(Math.floor(numCards / 2))),
  pairs: [],
  firstSelected: null,
  secondSelected: null
})

const App: React.FC = () => {
  const [current, send] = useMachine(machine)

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
  }, [current.value, send])

  const scale = 20 / current.context.cards.length

  return current.matches('finished') ? (
    <CardGrid>
      {current.context.cards.map((card, index) => (
        <CollectedCard key={index} cardId={card.type} scale={scale} />
      ))}
    </CardGrid>
  ) : (
    <div>
      <CardGrid>
        {current.context.cards.map((card, index) => {
          const visible = card === firstSelected || card === secondSelected
          return !card.collected ? (
            visible ? (
              <Card key={index} cardId={card.type} scale={scale} />
            ) : (
              <CardBack
                key={index}
                onSelect={() => selectCard(card)}
                scale={scale}
              />
            )
          ) : (
            <NoCard key={index} scale={scale} />
          )
        })}
      </CardGrid>
      <br />
      <br />
      <br />
      <Footer />
    </div>
  )
}

export default App


