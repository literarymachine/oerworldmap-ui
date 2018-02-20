import React from 'react'
import PropTypes from 'prop-types'

import ListItem from './ListItem'
import withFormData from './withFormData'

const List = ({name, value, children, errors}) => (
  <div className="List" role="group" aria-labelledby={`${name}-label`}>
    <div className="label" id={`${name}-label`}>{name}</div>
    {errors.map((error, index) => (
      <div className="error" key={index}>{error.message}</div>
    ))}
    <ul>
      {value.map((item, index) => (
        <ListItem property={index} key={index}>
          {React.cloneElement(children)}
        </ListItem>
      ))}
      <ListItem property={value.length} key={value.length}>
        {value.length ? (
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
        ) : React.cloneElement(children)}
      </ListItem>
    </ul>
  </div>
)

List.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(PropTypes.any),
  children: PropTypes.element.isRequired,
  errors: PropTypes.arrayOf(PropTypes.object)
}

List.defaultProps = {
  value: [],
  errors: []
}

export default withFormData(List)
