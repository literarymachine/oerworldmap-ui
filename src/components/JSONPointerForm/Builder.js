import React from 'react'
import PropTypes from 'prop-types'
import jsonPointer from 'json-pointer'
import Ajv from 'ajv'

import JsonSchema from './JsonSchema'
import Form from './Form'
import Fieldset from './Fieldset'
import Input from './Input'
import List from './List'
import Select from './Select'

class Builder extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      errors: []
    }
    this.ajv = new Ajv({
      schemaId: 'id',
      allErrors: true,
      jsonPointers: true
    })
    this.ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'))
    this.instanceSchema = JsonSchema(props.schema).get('#/definitions/Organization')
    console.info(this.instanceSchema)
    this.validate = this.ajv.compile(this.instanceSchema)
    this.formComponents = this.processSchema(this.instanceSchema)
  }

  onSubmit = (data) => this.validate(data)
    ? console.log("valid", data)
    : this.setState(
      {errors: this.validate.errors},
      () => console.warn("invalid", this.validate.errors, data)
    )

  processSchema = (schema) => {
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
        return <List>{this.processSchema(schema.items)}</List>
      case 'object':
        return (
          <Fieldset>
            {Object.keys(schema.properties).map((property) => React.cloneElement(
              this.processSchema(schema.properties[property]), {
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
    <Form onSubmit={this.onSubmit} errors={this.state.errors} data={this.props.data}>
      {this.formComponents}
    </Form>
  )

}

Builder.propTypes = {
  schema: PropTypes.objectOf(PropTypes.any)
}

export default Builder
