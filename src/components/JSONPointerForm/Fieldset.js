import React from 'react'
import PropTypes from 'prop-types'

import withFormData from './withFormData'

const Fieldset = ({name, children}) => (
  <fieldset>
    <legend>{name}</legend>
    {children}
  </fieldset>
)

Fieldset.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}

export default withFormData(Fieldset)
