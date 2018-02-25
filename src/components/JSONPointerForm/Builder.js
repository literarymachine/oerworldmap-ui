import React from 'react'
import PropTypes from 'prop-types'

import JsonSchema from './JsonSchema'
import Form from './Form'
import Fieldset from './Fieldset'
import Input from './Input'
import List from './List'
import Select from './Select'

class Builder extends React.Component {

  constructor(props) {
    super(props)
    this.formComponents = this.getComponent(props.schema)
  }

  getComponent = (schema) => {
    switch (schema.type) {
      case 'string':
        return schema.enum
          ? <Select options={schema.enum} />
          : <Input type="text" />
      case 'integer':
      case 'number':
        return <Input type="number" />
      case 'boolean':
        return <Input type="checkbox" />
      case 'array':
        return <List>{this.getComponent(schema.items)}</List>
      case 'object':
        return (
          <Fieldset>
            {Object.keys(schema.properties).map((property) => React.cloneElement(
              this.getComponent(schema.properties[property]), {
                property, key: property
              }
            ))}
          </Fieldset>
        )
      case 'null':
      default:
        console.warn('Could not determine form component for', schema)
        return <Input type="text" />
    }
  }

  render = () => (
    <div className="Builder">
      {this.formComponents}
    </div>
  )

}

Builder.propTypes = {
  schema: PropTypes.objectOf(PropTypes.any)
}

export default Builder
