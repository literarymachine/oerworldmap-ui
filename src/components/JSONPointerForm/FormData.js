import mitt from 'mitt'
import jsonPointer from 'json-pointer'

class FormData {

  constructor(initialState) {
    const state = {}

    Object.assign(this, mitt(), {
      get: (pointer) => pointer
        ? jsonPointer.has(state, pointer)
          ? jsonPointer.get(state, pointer)
          : undefined
        : state
    })

    this.on('*', (action, {name, value}) => {
      switch (action) {
        case 'change':
        case 'add':
          jsonPointer.set(state, name, value)
          break
        case 'remove':
          jsonPointer.remove(state, name)
          break
      }
      console.log(action, name, value, state)
    })
  }

}

export default FormData
