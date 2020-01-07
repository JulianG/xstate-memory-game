import { assign, createMachine } from 'xstate'

export type GameCard = {
  type: number
  collected: boolean
}
export type GameContext = {
  cards: GameCard[]
  pairs: GameCard[]
  firstSelected?: GameCard | undefined
  secondSelected?: GameCard | undefined
}

type GameTypeStates =
  | {
      value: 'idle'
      context: GameContext & {
        firstSelected: undefined
        secondSelected: undefined
      }
    }
  | {
      value: 'oneSelected'
      context: GameContext & {
        firstSelected: GameCard
        secondSelected: undefined
      }
    }
  | {
      value: 'twoSelected'
      context: GameContext & {
        firstSelected: GameCard
        secondSelected: GameCard
      }
    }
  | {
      value: 'comparing'
      context: GameContext & {
        firstSelected: GameCard
        secondSelected: GameCard
      }
    }
  | {
      value: 'finished'
      context: GameContext & {
        firstSelected: undefined
        secondSelected: undefined
      }
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
  return createMachine<GameContext, GameEvent, GameTypeStates>(
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
          after: {
            500: 'comparing'
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
        compareSelections: assign(context => {
          const { firstSelected, secondSelected, pairs } = context
          if (firstSelected!.type === secondSelected!.type) {
            pairs.push(firstSelected!, secondSelected!)
            firstSelected!.collected = true
            secondSelected!.collected = true
          }
          context.firstSelected = context.secondSelected = undefined
          return context
        }),
        selectFirst: assign((context, e) => {
          context.firstSelected = context.cards[(e as SelectEvent).index]
          return context
        }),
        selectSecond: assign((context, e) => {
          context.secondSelected = context.cards[(e as SelectEvent).index]
          return context
        })
      }
    }
  )
}
