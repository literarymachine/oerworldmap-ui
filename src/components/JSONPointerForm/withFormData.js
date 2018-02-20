import React from 'react'
import PropTypes from 'prop-types'
import jsonPointer from 'json-pointer'
import _ from 'lodash'

// https://stackoverflow.com/a/26202058
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
      this.getErrors = this.getErrors.bind(this)
    }

    getChildContext() {
      return {
        path: this.path,
        formData: this.context.formData,
        formErrors: this.context.formErrors
      }
    }

    getValue() {
      return jsonPointer.has(this.context.formData, this.name)
        ? jsonPointer.get(this.context.formData, this.name)
        : undefined
    }

    setValue(value) {
      jsonPointer.set(this.context.formData, this.name, value)
      this.context.setFormData(prune(this.context.formData))
    }

    getErrors() {
      return this.context.formErrors.filter(
        (error) => error.keyword === 'required'
          ? `${error.dataPath}/${error.params.missingProperty}` === this.name
          : error.dataPath === this.name
      )
    }

    render() {
      return (
        <BaseComponent
          {...this.props}
          name={this.name}
          value={this.getValue()}
          setValue={this.setValue}
          errors={this.getErrors()}
        />
      )
    }

  }

  formComponent.childContextTypes = {
    path: PropTypes.array,
    formData: PropTypes.objectOf(PropTypes.any),
    formErrors: PropTypes.arrayOf(PropTypes.object),
    setFormData: PropTypes.func
  }

  formComponent.contextTypes = {
    path: PropTypes.array,
    formData: PropTypes.objectOf(PropTypes.any),
    formErrors: PropTypes.arrayOf(PropTypes.object),
    setFormData: PropTypes.func
  }

  return formComponent

}

export default withFormData
