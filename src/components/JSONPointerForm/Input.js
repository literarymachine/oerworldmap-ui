import React from 'react'
import PropTypes from 'prop-types'

import withFormData from './withFormData'

const Input = ({type, name, value, setValue}) => (
  <input
    type={type}
    name={name}
    value={value}
    placeholder={name}
    onChange={e => setValue(
      e.target.type === 'checkbox'
        ? (e.target.checked ? "true" : null)
        : e.target.value
    )}
  />
)

Input.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  setValue: PropTypes.func.isRequired
}

Input.defaultProps = {
  type: 'text',
  value: ''
}

export default withFormData(Input)
