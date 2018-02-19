import React from 'react'
import PropTypes from 'prop-types'

import withFormData from './withFormData'

const Fieldset = ({name, children}) => (
  <div role="group" aria-labelledby={`${name}-label`}>
    <div id={`${name}-label`}>{name}</div>
    {children}
  </div>
)

Fieldset.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}

export default withFormData(Fieldset)
