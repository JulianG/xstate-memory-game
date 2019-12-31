import { createMemoryGameMachine, GameContext } from './memory-game'
import { interpret } from 'xstate'
import { createCards } from './factory'

describe('memory-game', () => {
  test('selecting 2 cards', () => {
    const machine = createMemoryGameMachine({
      cards: createCards(3),
      pairs: [],
      firstSelected: null,
      secondSelected: null
    })

    const service = interpret(machine).start()

    service.onTransition(state => console.log('state', state.value))

    service.send({ type: 'SELECT', index: 0 })

    expect(service.state.value).toEqual('oneSelected')
    expect(service.machine.context!.firstSelected) //
      .toMatchObject({ type: 1 }) // ok

    service.send({ type: 'SELECT', index: 1 })

    expect(service.state.value).toEqual('twoSelected')
    expect(service.machine.context!.secondSelected) //
      .toMatchObject({ type: 1 }) // fails here. apparently secondSelected is null
  })
})
