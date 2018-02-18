import React from 'react'
import PropTypes from 'prop-types'
import jsonPointer from 'json-pointer'
import _ from 'lodash'

const withFormData = (BaseComponent) => {

  const formComponent = class FormComponent extends React.Component {

    getChildContext() {
      return {
        path: this.getPath(),
        formData: this.getFormData()
      }
    }

    getPath() {
      const parents = this.context.path || []
      return this.props.property != null ? [...parents, this.props.property] : parents
    }

    getFormData() {
      return this.context.formData || {}
    }

    render() {
      const name = jsonPointer.compile(this.getPath())
      const value = jsonPointer.has(this.getFormData(), name)
        ? jsonPointer.get(this.getFormData(), name) : undefined
      const setValue = value => {
        console.log(name, value, value !== null)
        // Clone current state so it is not modified in place
        const copy = JSON.parse(JSON.stringify(this.getFormData()))
        value == null ? jsonPointer.remove(copy, name) : jsonPointer.set(copy, name, value)
        // This is necessary to remove potential empty array values
        this.context.setFormData(
          Object.entries(jsonPointer.dict(copy)).reduce((acc, curr) => {
            curr[1] != null && jsonPointer.set(acc, curr[0], curr[1])
            return acc
          }, {})
        )
      }

      return <BaseComponent {...this.props} name={name} value={value} setValue={setValue} />

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
