import mitt from 'mitt'
import jsonPointer from 'json-pointer'

const prune = (current) => {
  _.forOwn(current, (value, key) => {
    if (_.isUndefined(value) || _.isNull(value) || _.isNaN(value) ||
      (_.isString(value) && _.isEmpty(value)) ||
      (_.isObject(value) && _.isEmpty(prune(value)))) {
      delete current[key]
    }
  })
  if (_.isArray(current)) {
    _.pull(current, undefined)
  }
  return current
}

class FormData {

  constructor(initialState) {
    let state = initialState || {}

    Object.assign(this, mitt(), {
      get: (pointer) => jsonPointer.has(state, pointer)
        ? jsonPointer.get(state, pointer)
        : undefined
    })

    this.on('set', ({name, value}) => {
      this.emit('update', {name, value})
      let nextState = JSON.parse(JSON.stringify(state))
      jsonPointer.set(nextState, name, value)
      nextState = prune(nextState)
      const size = Object.keys(jsonPointer.dict(state)).length
      const nextSize = Object.keys(jsonPointer.dict(nextState)).length
      const added = nextSize > size
      const removed = !added && nextSize < size
      if (added || removed) {
        const rootProperty = jsonPointer.parse(name)[0]
        this.emit('update', {
          name: `/${rootProperty}`,
          value: nextState[rootProperty]
        })
      }
      state = nextState
    })
  }

}

export default FormData
