import React from 'react'
import PropTypes from 'prop-types'

import Input from './Input'
import Fieldset from './Fieldset'
import List from './List'
import ListItem from './ListItem'

class Form extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      formData: {}
    }
  }

  getChildContext() {
    return {
      formData: JSON.parse(JSON.stringify(this.state.formData)),
      formErrors: JSON.parse(JSON.stringify(this.props.errors)),
      setFormData: formData => this.setState({formData})
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
  formData: PropTypes.objectOf(PropTypes.any),
  formErrors: PropTypes.arrayOf(PropTypes.object),
  setFormData: PropTypes.func
}

export default Form
