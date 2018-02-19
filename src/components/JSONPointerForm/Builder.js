import React from 'react'
import PropTypes from 'prop-types'
import jsonPointer from 'json-pointer'

import Form from './Form'
import Fieldset from './Fieldset'
import Input from './Input'
import List from './List'

const cloneSchema = (schema) => JSON.parse(JSON.stringify(schema))

const mergeSchemas = (schemas) => schemas.reduce(
  (acc, curr) => Object.assign(acc, curr), {}
)

const getSchema = (root, ptr) => resolveRefs(
  root, cloneSchema(jsonPointer.get(root, ptr.slice(1)))
)

const resolveRefs = (root, schema) => {
  Object.keys(schema.properties || {}).forEach((property) => {
    if ('$ref' in schema.properties[property]) {
      schema.properties[property] = mergeSchemas([
        getSchema(root, schema.properties[property]['$ref']),
        schema.properties[property]
      ])
      delete(schema.properties[property]['$ref'])
    }
  })
  return schema
}

const processSchema = (root, schema) => {
  switch (schema.type) {
    case 'string':
      return <Input type="text" />
    case 'integer':
    case 'number':
      return <Input type="number" />
    case 'boolean':
      return <Input type="checkbox" />
    case 'array':
      return <List>{processSchema(root, resolveRefs(root, schema.items))}</List>
    case 'object':
      return (
        <Fieldset>
          {Object.keys(schema.properties).map((property) => React.cloneElement(
            processSchema(root, resolveRefs(root, schema.properties[property])), {property}
          ))}
        </Fieldset>
      )
    case 'null':
    default:
      console.warn('Could not build form component for', schema)
  }
}

const Builder = ({schema}) => (
  <Form>
    {console.log(getSchema(schema, '#/definitions/Organization'))}
    {processSchema(schema, getSchema(schema, '#/definitions/Organization'))}
  </Form>
)

Builder.propTypes = {
  schema: PropTypes.objectOf(PropTypes.any)
}

export default Builder
