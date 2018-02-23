import React from 'react'
import PropTypes from 'prop-types'

import withFormData from './withFormData'

const Fieldset = ({name, children, errors, property}) => (
  <div className={`Fieldset ${property || ''}`.trim()} role="group" aria-labelledby={`${name}-label`}>
    <div className="label" id={`${name}-label`}>{property}</div>
    {errors.map((error, index) => (
      <div className="error" key={index}>{error.message}</div>
    ))}
    {children}
  </div>
)

Fieldset.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  errors: PropTypes.arrayOf(PropTypes.object)
}

Fieldset.defaultProps = {
  errors: []
}

export default withFormData(Fieldset)
