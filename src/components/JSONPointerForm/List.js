import React from 'react'
import PropTypes from 'prop-types'

import ListItem from './ListItem'
import withFormData from './withFormData'

const List = ({name, value, children, setValue, defaultValue}) => (
  <ul>
    {value.map((item, index) => (
      <ListItem property={index} key={index}>
        {React.cloneElement(children)}
      </ListItem>
    ))}
    <li>
      <button type="button" onClick={() => setValue(value.concat(defaultValue))}>
        Add {name}
      </button>
    </li>
  </ul>
)

List.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(PropTypes.any),
  children: PropTypes.element.isRequired
}

List.defaultProps = {
  value: []
}

export default withFormData(List)
