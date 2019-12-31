import { createMemoryGameMachine, GameContext } from './memory-game'
import { interpret } from 'xstate'
import { createCards } from './factory'

describe('memory-game', () => {
  test('happy path', () => {
    const machine = createMemoryGameMachine({
      cards: createCards(3),
      pairs: [],
      firstSelected: null,
      secondSelected: null
    })

    const service = interpret(machine).start()

    const getContext = () => service.state.context
    const assertState = (s: string) => {
      expect(service.state.matches(s)).toBe(true)
    }

    service.send({ type: 'SELECT', index: 0 })

    assertState('oneSelected')
    expect(getContext().firstSelected).toMatchObject({ type: 1 })

    service.send({ type: 'SELECT', index: 1 })

    assertState('twoSelected')
    expect(getContext().firstSelected).toMatchObject({ type: 1 })
    expect(getContext().secondSelected).toMatchObject({ type: 1 })

    service.send('CONTINUE')

    assertState('idle')
    expect(getContext().firstSelected).toBeNull()
    expect(getContext().secondSelected).toBeNull()
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

    assertState('idle')
    expect(getContext().firstSelected).toBeNull()
    expect(getContext().secondSelected).toBeNull()
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

    assertState('idle')
    expect(getContext().firstSelected).toBeNull()
    expect(getContext().secondSelected).toBeNull()
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

    assertState('idle')
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

    assertState('finished')
  })
})
