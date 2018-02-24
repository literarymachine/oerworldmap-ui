import React from 'react'
import PropTypes from 'prop-types'
import mitt from 'mitt'
import jsonPointer from 'json-pointer'
import { detailedDiff } from 'deep-object-diff'

import Input from './Input'
import Fieldset from './Fieldset'
import List from './List'
import ListItem from './ListItem'

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


class Form extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      value: props.data || {}
    }
    this.value = props.data || {}
    this.emitter = mitt()
    this.emitter.on('set', ({name, value}) => {
      this.emitter.emit('update', {name, value})
      let after = JSON.parse(JSON.stringify(this.value))
      jsonPointer.set(after, name, value)
      after = prune(after)
      const change = detailedDiff(this.value, after)
      this.value = after
      Object.keys(change.added).forEach(property =>
        name !== `/${property}` &&
          this.emitter.emit('update', {
            name: `/${property}`,
            value: this.value[property]
          })
      )
      Object.keys(change.deleted).forEach(property =>
        name !== `/${property}` &&
          this.emitter.emit('update', {
            name: `/${property}`,
            value: this.value[property]
          })
      )
    })
  }

  getChildContext() {
    return {
      formData: Object.assign({
        get: (pointer) => jsonPointer.has(this.value, pointer)
          ? jsonPointer.get(this.value, pointer)
          : undefined
      }, this.emitter)
    }
  }

  render() {
    return (
      <form
        className="Form"
        action={this.props.action}
        method={this.props.method}
        onSubmit={e => {
          e.preventDefault()
          this.props.onSubmit(this.state.formData)
        }}
      >
        {this.props.children}
        <input type="submit" />
      </form>
    )
  }

}

Form.propTypes = {
  action: PropTypes.string,
  method: PropTypes.string,
  onSubmit: PropTypes.func,
  children: PropTypes.node.isRequired
}

Form.defaultProps = {
  action: '',
  method: 'get',
  onSubmit: formData => console.log(formData)
}

Form.childContextTypes = {
  formData: PropTypes.objectOf(PropTypes.any)
}

export default Form
