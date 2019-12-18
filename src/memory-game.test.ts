import { createMemoryGameMachine } from './memory-game'
import { interpret } from 'xstate'

describe('memory-game', () => {
  test('happy path', () => {
    const m = createMemoryGameMachine({
      cards: [
        { type: 1 },
        { type: 1 },
        { type: 2 },
        { type: 2 },
        { type: 3 },
        { type: 3 }
      ],
      pairs: [],
      firstSelected: null,
      secondSelected: null
    })

    const service = interpret(m).start()

    const getContext = () => service.machine.context!
    const getState = () => service.state.value

    service.send({ type: 'SELECT', index: 0 })
    expect(getState()).toEqual('oneSelected')
    expect(getContext().firstSelected).toEqual({ type: 1 }) 
   
    service.send({ type: 'SELECT', index: 1 })
    expect(getState()).toEqual('twoSelected')
    expect(getContext().secondSelected).toEqual({ type: 1 })

    expect(getContext().pairs).toEqual([{ type: 1 }, { type: 1 }])
    expect(getContext().cards).toMatchObject([
      null,
      null,
      { type: 2 },
      { type: 2 },
      { type: 3 },
      { type: 3 }
    ])
    expect(getContext().firstSelected).toBeNull()
    expect(getContext().secondSelected).toBeNull()

    expect(getState()).toEqual('idle')

    service.send({ type: 'SELECT', index: 2 })
    expect(getState()).toEqual('oneSelected')
    expect(getContext().firstSelected).toEqual({ type: 2 })

    service.send({ type: 'SELECT', index: 4 })
    expect(getState()).toEqual('twoSelected')
    expect(getContext().secondSelected).toEqual({ type: 3 })

    service.send({ type: 'COMPARE' })
    expect(getContext().pairs).toEqual([{ type: 1 }, { type: 1 }])
    expect(getContext().cards).toMatchObject([
      null,
      null,
      { type: 2 },
      { type: 2 },
      { type: 3 },
      { type: 3 }
    ])
    expect(getContext().firstSelected).toBeNull()
    expect(getContext().secondSelected).toBeNull()

    expect(getState()).toEqual('idle')

    service.send({ type: 'SELECT', index: 2 })
    expect(getState()).toEqual('oneSelected')
    expect(getContext().firstSelected).toEqual({ type: 2 })

    service.send({ type: 'SELECT', index: 3 })
    expect(getState()).toEqual('twoSelected')
    expect(getContext().secondSelected).toEqual({ type: 2 })

    service.send({ type: 'COMPARE' })
    expect(getContext().pairs).toEqual([
      { type: 1 },
      { type: 1 },
      { type: 2 },
      { type: 2 }
    ])
    expect(getContext().cards).toMatchObject([
      null,
      null,
      null,
      null,
      { type: 3 },
      { type: 3 }
    ])
    expect(getContext().firstSelected).toBeNull()
    expect(getContext().secondSelected).toBeNull()

    expect(getState()).toEqual('idle')

    service.send({ type: 'SELECT', index: 4 })
    expect(getState()).toEqual('oneSelected')
    expect(getContext().firstSelected).toEqual({ type: 3 })

    service.send({ type: 'SELECT', index: 5 })
    expect(getState()).toEqual('twoSelected')
    expect(getContext().secondSelected).toEqual({ type: 3 })

    service.send({ type: 'COMPARE' })

    expect(getContext().pairs).toEqual([
      { type: 1 },
      { type: 1 },
      { type: 2 },
      { type: 2 },
      { type: 3 },
      { type: 3 }
    ])
    expect(getContext().cards).toMatchObject([
      null,
      null,
      null,
      null,
      null,
      null
    ])
    expect(getContext().firstSelected).toBeNull()
    expect(getContext().secondSelected).toBeNull()

    expect(getState()).toEqual('finished')
  })
})
