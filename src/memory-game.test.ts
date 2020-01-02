import { createMemoryGameMachine, GameContext } from './memory-game'
import { interpret, State, EventObject } from 'xstate'
import { createCards } from './factory'

describe('memory-game', () => {
  test('happy path', () => {
    const machine = createMemoryGameMachine({
      cards: createCards(3),
      pairs: [],
      firstSelected: undefined,
      secondSelected: undefined
    })

    const service = interpret(machine).start()

    const getState = () => service.state
    const getContext = () => service.state.context

    service.send({ type: 'SELECT', index: 0 })

    expect(getState().value).toBe('oneSelected')
    expect(getContext().firstSelected).toMatchObject({ type: 1 })

    service.send({ type: 'SELECT', index: 1 })

    expect(getState().value).toBe('twoSelected')
    expect(getContext().firstSelected).toMatchObject({ type: 1 })
    expect(getContext().secondSelected).toMatchObject({ type: 1 })

    service.send('CONTINUE')

    expect(getState().value).toBe('idle')
    expect(getContext().firstSelected).toBeUndefined()
    expect(getContext().secondSelected).toBeUndefined()
    expect(getContext().pairs).toMatchObject([{ type: 1 }, { type: 1 }])
    expect(getContext().cards).toMatchObject([
      { type: 1, collected: true },
      { type: 1, collected: true },
      { type: 2 },
      { type: 2 },
      { type: 3 },
      { type: 3 }
    ])

    service.send({ type: 'SELECT', index: 2 })
    expect(getContext().firstSelected).toMatchObject({ type: 2 })

    service.send({ type: 'SELECT', index: 4 })
    expect(getContext().secondSelected).toMatchObject({ type: 3 })

    service.send({ type: 'CONTINUE' })

    expect(getState().value).toBe('idle')
    expect(getContext().firstSelected).toBeUndefined()
    expect(getContext().secondSelected).toBeUndefined()
    expect(getContext().pairs).toMatchObject([{ type: 1 }, { type: 1 }])
    expect(getContext().cards).toMatchObject([
      { type: 1, collected: true },
      { type: 1, collected: true },
      { type: 2 },
      { type: 2 },
      { type: 3 },
      { type: 3 }
    ])

    service.send({ type: 'SELECT', index: 2 })
    service.send({ type: 'SELECT', index: 3 })

    expect(getContext().firstSelected).toMatchObject({ type: 2 })
    expect(getContext().firstSelected).toMatchObject({ type: 2 })

    service.send({ type: 'CONTINUE' })

    expect(getState().value).toBe('idle')
    expect(getContext().firstSelected).toBeUndefined()
    expect(getContext().secondSelected).toBeUndefined()
    expect(getContext().pairs).toMatchObject([
      { type: 1 },
      { type: 1 },
      { type: 2 },
      { type: 2 }
    ])
    expect(getContext().cards).toMatchObject([
      { type: 1, collected: true },
      { type: 1, collected: true },
      { type: 2, collected: true },
      { type: 2, collected: true },
      { type: 3 },
      { type: 3 }
    ])

    service.send({ type: 'SELECT', index: 4 })
    service.send({ type: 'SELECT', index: 5 })

    expect(getContext().firstSelected).toMatchObject({ type: 3 })
    expect(getContext().secondSelected).toMatchObject({ type: 3 })

    service.send({ type: 'CONTINUE' })

    expect(getState().value).toBe('finished')
    expect(getContext().pairs).toMatchObject([
      { type: 1 },
      { type: 1 },
      { type: 2 },
      { type: 2 },
      { type: 3 },
      { type: 3 }
    ])
    expect(getContext().cards).toMatchObject([
      { type: 1, collected: true },
      { type: 1, collected: true },
      { type: 2, collected: true },
      { type: 2, collected: true },
      { type: 3, collected: true },
      { type: 3, collected: true }
    ])
  })
})
