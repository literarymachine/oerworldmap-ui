import React from 'react'
import PropTypes from 'prop-types'
import jsonPointer from 'json-pointer'
import _ from 'lodash'

const withFormData = (BaseComponent) => {

  const formComponent = class FormComponent extends React.Component {

    constructor(props, context) {
      super(props)
      const parents = context.path || []
      this.path = props.property != null
        ? [...parents, props.property]
        : parents
      this.name = jsonPointer.compile(this.path)
      this.getValue = this.getValue.bind(this)
      this.setValue = this.setValue.bind(this)
    }

    getChildContext() {
      return {
        path: this.path,
        formData: this.context.formData
      }
    }

    getValue() {
      return jsonPointer.has(this.context.formData, this.name)
        ? jsonPointer.get(this.context.formData, this.name)
        : undefined
    }

    setValue(value) {
      const formData = JSON.parse(JSON.stringify(this.context.formData))
      value == null
        ? jsonPointer.remove(formData, this.name)
        : jsonPointer.set(formData, this.name, value)
      this.context.setFormData(formData)
    }

    render() {
      return <BaseComponent {...this.props} name={this.name} value={this.getValue()} setValue={this.setValue} />
    }

  }

  formComponent.childContextTypes = {
    path: PropTypes.array,
    formData: PropTypes.objectOf(PropTypes.any),
    setFormData: PropTypes.func
  }

  formComponent.contextTypes = {
    path: PropTypes.array,
    formData: PropTypes.objectOf(PropTypes.any),
    setFormData: PropTypes.func
  }

  return formComponent

}

export default withFormData
