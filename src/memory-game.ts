import { Machine } from 'xstate'

export type GameCard = {
  type: number
}
export type GameContext = {
  cards: (GameCard | null)[]
  pairs: (GameCard | null)[]
  firstSelected: GameCard | null
  secondSelected: GameCard | null
}

type SelectEvent = {
  type: 'SELECT'
  index: number
}
type ContinueEvent = {
  type: 'CONTINUE'
}
type GameEvent = SelectEvent | ContinueEvent

const isFinished = (c: GameContext) => {
  return c.cards.every(c => c === null)
}
const isNotFinished = (c: GameContext) => {
  return !isFinished(c)
}

export function createMemoryGameMachine(initialContext: GameContext) {
  return Machine<GameContext, GameEvent>(
    {
      id: 'memory',
      initial: 'idle',
      context: initialContext,
      states: {
        idle: {
          on: {
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
            CONTINUE: 'comparing'
          }
        },
        comparing: {
          entry: 'compareSelections',
          on: {
            '': [
              {
                target: 'finished',
                cond: isFinished
              },
              {
                target: 'idle',
                cond: isNotFinished
              }
            ]
          }
        },
        finished: {
          type: 'final'
        }
      }
    },
    {
      actions: {
        compareSelections: (context: GameContext) => {
          const { firstSelected, secondSelected, cards, pairs } = context
          if (firstSelected!.type === secondSelected!.type) {
            pairs.push(firstSelected, secondSelected)
            cards[cards.indexOf(firstSelected)] = null
            cards[cards.indexOf(secondSelected)] = null
          }
          context.firstSelected = context.secondSelected = null
          return context
        },
        selectFirst: (context: GameContext, e) => {
          context.firstSelected = context.cards[(e as SelectEvent).index]
          return context
        },
        selectSecond: (context: GameContext, e) => {
          context.secondSelected = context.cards[(e as SelectEvent).index]
          return context
        }
      }
    }
  )
}
