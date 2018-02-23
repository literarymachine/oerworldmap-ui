import React from 'react'
import PropTypes from 'prop-types'

import withFormData from './withFormData'

const Select = ({name, value, setValue, errors, options, property}) => (
  <div className={`Select ${property || ''}`.trim()}>
    <label htmlFor={name}>{property}</label>
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
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  setValue: PropTypes.func.isRequired,
  errors: PropTypes.arrayOf(PropTypes.object),
  options: PropTypes.arrayOf(PropTypes.string).isRequired
}

Select.defaultProps = {
  value: '',
  errors: []
}

export default withFormData(Select)
