import React from 'react'
import PropTypes from 'prop-types'

import withFormData from './withFormData'

let changed = null
const autoFocus = (name) => {
  const focus = changed === name
  changed = focus ? null : changed
  return focus
}

const onFocus = (e) => {
  const tmp = e.target.value
  e.target.value = ''
  e.target.value = tmp
}

const Input = ({type, name, value, setValue}) => (
  <div className={`input ${type} ${name}`}>
    <label htmlFor={name}>{name}</label>
    <input
      type={type}
      name={name}
      value={value}
      id={name}
      placeholder={name}
      autoFocus={autoFocus(name)}
      onFocus={onFocus}
      onChange={(e) => {
        changed = name
        setValue(
          e.target.type === 'checkbox'
            ? (e.target.checked ? "true" : null)
            : e.target.value
        )
      }}
    />
  </div>
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
