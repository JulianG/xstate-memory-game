import { Machine } from 'xstate'

export type GameCard = {
  type: number
  collected: boolean
}
export type GameContext = {
  cards: GameCard[]
  pairs: GameCard[]
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

const isFinished = (c: GameContext) => c.cards.every(c => c.collected)
const isNotFinished = (c: GameContext) => !isFinished(c)


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
          const { firstSelected, secondSelected, pairs } = context
          if (firstSelected!.type === secondSelected!.type) {
            pairs.push(firstSelected!, secondSelected!)
            firstSelected!.collected = true
            secondSelected!.collected = true
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
