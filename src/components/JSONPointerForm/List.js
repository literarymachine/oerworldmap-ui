import React from 'react'
import PropTypes from 'prop-types'

import ListItem from './ListItem'
import withFormData from './withFormData'

const List = ({value, children}) => (
  <ul>
    {value.map((item, index) => (
      <ListItem property={index} key={index}>
        {React.cloneElement(children)}
      </ListItem>
    ))}
    <ListItem property={value.length} key={value.length}>
      {React.cloneElement(children)}
    </ListItem>
  </ul>
)

List.propTypes = {
  value: PropTypes.arrayOf(PropTypes.any),
  children: PropTypes.element.isRequired
}

List.defaultProps = {
  value: []
}

export default withFormData(List)
