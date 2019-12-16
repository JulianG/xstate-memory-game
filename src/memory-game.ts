import { Machine } from 'xstate'

type Card = {
  type: number
}
type GameContext = {
  cards: Card[]
  pairs: Card[]
  firstSelected: Card | null
  secondSelected: Card | null
}

const isFinished = (c: GameContext) => c.cards.length === 0

export function createMemoryGameMachine(initialContext: GameContext) {
  return Machine(
    {
      id: 'memory',
      initial: 'idle',
      context: initialContext,
      states: {
        idle: {
          on: {
            '': {
              target: 'finished',
              cond: isFinished
            },
            SELECT: {
              target: 'oneSelected',
              actions: ['selectFirst']
            }
          }
        },
        oneSelected: {
          on: {
            SELECT: {
              target: 'twoSelected',
              actions: ['selectSecond']
            }
          }
        },
        twoSelected: {
          on: {
            COMPARE: 'comparing'
          }
        },
        comparing: {
          entry: 'compareSelections',
          on: {
            '': 'idle'
          }
        },
        finished: {
          type: 'final'
        }
      }
    },
    {
      actions: {
        selectFirst: (context, e) => {
          context.firstSelected = context.cards[e.index || 0]
          return context
        },
        selectSecond: (context, e) => {
          context.secondSelected = context.cards[e.index || 1]
          return context
        },
        compareSelections: (context, e) => {
          const { firstSelected, secondSelected, cards, pairs } = context
          if (
            firstSelected &&
            secondSelected &&
            firstSelected.type === secondSelected.type
          ) {
            pairs.push(firstSelected, secondSelected)
            cards.splice(cards.indexOf(firstSelected), 1)
            cards.splice(cards.indexOf(secondSelected), 1)
          }
          context.firstSelected = context.secondSelected = null
          return context
        }
      }
    }
  )
}
