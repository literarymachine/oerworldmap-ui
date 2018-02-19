import React from 'react'
import PropTypes from 'prop-types'
import jsonPointer from 'json-pointer'
import merge from 'deepmerge'

import Form from './Form'
import Fieldset from './Fieldset'
import Input from './Input'
import List from './List'

const cloneSchema = (schema) => JSON.parse(JSON.stringify(schema))

const getSchema = (root, ptr) => expandSchema(
  root, cloneSchema(jsonPointer.get(root, ptr.slice(1)))
)

const expandSchema = (root, schema) => {
  schema = resolveRefs(root, schema)
  if ('items' in schema) {
    schema.items = expandSchema(root, schema.items)
  }
  if ('allOf' in schema) {
    schema.allOf.forEach((allOf) =>
      schema = merge(schema, expandSchema(root, allOf))
    )
    delete schema.allOf
  }
  Object.keys(schema.properties || {}).forEach((property) => {
    schema.properties[property] = expandSchema(
      root, schema.properties[property]
    )
  })
  return schema
}

const resolveRefs = (root, schema) => {
  if ('$ref' in schema) {
    schema = merge(getSchema(root, schema['$ref']), schema)
    delete schema['$ref']
  }
  return schema
}

const processSchema = (schema) => {
  switch (schema.type) {
    case 'string':
      return <Input type="text" />
    case 'integer':
    case 'number':
      return <Input type="number" />
    case 'boolean':
      return <Input type="checkbox" />
    case 'array':
      return <List>{processSchema(schema.items)}</List>
    case 'object':
      return (
        <Fieldset>
          {Object.keys(schema.properties).map((property) => React.cloneElement(
            processSchema(schema.properties[property]), {
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

const Builder = ({schema}) => (
  <Form>
    {console.log(getSchema(schema, '#/definitions/Organization'))}
    {processSchema(getSchema(schema, '#/definitions/Organization'))}
  </Form>
)

Builder.propTypes = {
  schema: PropTypes.objectOf(PropTypes.any)
}

export default Builder
