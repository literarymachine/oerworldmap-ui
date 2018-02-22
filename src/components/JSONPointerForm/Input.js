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

const castValue = (target) => {
  switch (target.type) {
    case 'checkbox':
      return target.checked ? "true" : null
    default:
      // TODO: properly cast number to int or float
      return target.value
  }
}

const Input = ({type, name, value, setValue, errors}) => (
  <div className={`input ${type} ${name}`}>
    <label htmlFor={name}>{name}</label>
    {errors.map((error, index) => (
      <div className="error" key={index}>{error.message}</div>
    ))}
    <input
      type={type}
      name={name}
      value={value}
      id={name}
      placeholder={name}
      autoFocus={autoFocus(name)}
      onFocus={onFocus}
      onChange={(e) => changed = name && setValue(castValue(e.target))}
    />
  </div>
)

Input.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool
  ]),
  setValue: PropTypes.func.isRequired,
  errors: PropTypes.arrayOf(PropTypes.object)
}

Input.defaultProps = {
  type: 'text',
  value: '',
  errors: []
}

export default withFormData(Input)
