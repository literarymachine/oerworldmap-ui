import React from 'react'
import PropTypes from 'prop-types'

import ListItem from './ListItem'
import withFormData from './withFormData'

const List = ({
  name, value, children, errors, property, title, className, translate, maxItems, formId, required, empty
}) => (
  <div
    className={`List ${property || ''} ${className} ${errors.length ? 'hasError': ''} ${empty ? 'isEmpty': ''}`.trim()}
    role="group"
    aria-labelledby={`${formId}-${name}-label`}
  >
    <div
      className={`label ${required ? 'required' : ''}`.trim()}
      id={`${formId}-${name}-label`}
    >
      {translate(title)} {required ? <span className="asterisk" title={translate('This is a required field!')}>*</span> : ''}
    </div>
    {errors.map((error, index) => (
      <div className="error" key={index}>{error.message}</div>
    ))}
    <ul>
      {value.map((item, index) => (
        <ListItem property={index.toString()} key={index}>
          {React.cloneElement(children)}
        </ListItem>
      ))}
      {(!value.length || !maxItems || value.length < maxItems) &&
        <ListItem property={value.length.toString()} key={value.length}>
          {value.length && (!maxItems || value.length < maxItems) ? (
            <div className="newItemWrapper">
              <input
                type="checkbox"
                key={`${name}-${value.length}`}
                className="formControl"
                id={`${formId}-${name}-toggle`}
              />
              <label htmlFor={`${formId}-${name}-toggle`}>
                {translate('add', {type: translate(title)})}
              </label>
              <div className="newItem">
                {React.cloneElement(children)}
              </div>
            </div>
          ) : React.cloneElement(children)}
        </ListItem>
      }
    </ul>
  </div>
)

List.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(PropTypes.any),
  children: PropTypes.element.isRequired,
  errors: PropTypes.arrayOf(PropTypes.object),
  property: PropTypes.string,
  title: PropTypes.string,
  className: PropTypes.string,
  translate: PropTypes.func.isRequired,
  maxItems: PropTypes.number,
  formId: PropTypes.string.isRequired,
  required: PropTypes.bool,
  empty: PropTypes.bool
}

List.defaultProps = {
  value: [],
  errors: [],
  property: undefined,
  title: '',
  className: '',
  maxItems: undefined,
  required: false,
  empty: true
}

export default withFormData(List)
