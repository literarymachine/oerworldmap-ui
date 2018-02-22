import React from 'react'
import PropTypes from 'prop-types'

import withFormData from './withFormData'

const Select = ({type, name, value, setValue, errors, options}) => (
  <div className={`input ${type} ${name}`}>
    <label htmlFor={name}>{name}</label>
    {errors.map((error, index) => (
      <div className="error" key={index}>{error.message}</div>
    ))}
    <select
      name={name}
      value={value}
      id={name}
      onChange={(e) => setValue(e.target.value)}
    >
      <option value={null} />
      {options.map((option) => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  </div>
)

Select.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  setValue: PropTypes.func.isRequired,
  errors: PropTypes.arrayOf(PropTypes.object),
  options: PropTypes.arrayOf(PropTypes.string).isRequired
}

Select.defaultProps = {
  type: 'text',
  value: '',
  errors: []
}

export default withFormData(Select)
