import React from 'react'
import PropTypes from 'prop-types'

import ListItem from './ListItem'
import withFormData from './withFormData'

const List = ({name, value, children}) => (
  <div role="group" aria-labelledby={`${name}-label`}>
    <div id={`${name}-label`}>{name}</div>
    <ul>
      {value.map((item, index) => (
        <ListItem property={index} key={index}>
          {React.cloneElement(children)}
        </ListItem>
      ))}
      <ListItem property={value.length} key={value.length}>
        <div className="newItemWrapper">
          <input
            type="checkbox"
            key={`${name}-${value.length}`}
            className="formControl" id={`${name}-toggle`}
          />
          <label htmlFor={`${name}-toggle`}>Add {name}</label>
          <div className="newItem">
            {React.cloneElement(children)}
          </div>
        </div>
      </ListItem>
    </ul>
  </div>
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
