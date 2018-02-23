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
      this.state = {
        value: context.formData.get(this.name),
        errors: undefined
      }
      this.setValue = this.setValue.bind(this)
      this.receiveUpdate = this.receiveUpdate.bind(this)
    }

    receiveUpdate({name, value}) {
      name === this.name && this.setState({value})
    }

    componentDidMount() {
      this.context.formData.on('update', this.receiveUpdate)
    }

    componentWillUnmount() {
      this.context.formData.off('update', this.receiveUpdate)
    }

    getChildContext() {
      return {
        path: this.path,
        formData: this.context.formData
      }
    }

    setValue(value) {
      this.context.formData.emit('set', {name: this.name, value})
    }

    render() {
      return (
        <BaseComponent
          {...this.props}
          name={this.name}
          value={this.state.value}
          setValue={this.setValue}
          errors={this.state.errors}
        />
      )
    }

  }

  formComponent.childContextTypes = {
    path: PropTypes.array,
    formData: PropTypes.objectOf(PropTypes.any)
  }

  formComponent.contextTypes = {
    path: PropTypes.array,
    formData: PropTypes.objectOf(PropTypes.any)
  }

  return formComponent

}

export default withFormData
