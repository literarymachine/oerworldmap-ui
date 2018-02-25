import React from 'react'
import PropTypes from 'prop-types'

import FormData from './FormData'
import Input from './Input'
import Fieldset from './Fieldset'
import List from './List'
import ListItem from './ListItem'

class Form extends React.Component {

  constructor(props) {
    super(props)
    this.formData = new FormData(props.data)
  }

  getChildContext() {
    return {
      formData: this.formData
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
          const data = this.formData.get()
          this.props.validate(data)
            ? this.props.onSubmit(this.formData.get())
            : this.props.validate.errors.forEach(error =>
                this.formData.emit('error', {name: error.dataPath, errors: [error]})
              )
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
  validate: PropTypes.func,
  children: PropTypes.node.isRequired
}

Form.defaultProps = {
  action: '',
  method: 'get',
  onSubmit: formData => console.log(formData),
  validate: formData => true
}

Form.childContextTypes = {
  formData: PropTypes.objectOf(PropTypes.any)
}

export default Form
