import React from 'react'
import PropTypes from 'prop-types'
import { Composer } from 'json-pointer-form'

import Form from './JSONPointerForm/Form'


import Input from './JSONPointerForm/Input'
import Fieldset from './JSONPointerForm/Fieldset'
import List from './JSONPointerForm/List'
import ListItem from './JSONPointerForm/ListItem'
import Builder from './JSONPointerForm/Builder'

import withI18n from './withI18n'
import withEmitter from './withEmitter'
import FullModal from './FullModal'
import '../styles/components/Register.pcss'
import schema from '../json/schema.json'

const Register = ({translate, emitter}) => (
  <div className="">
    <FullModal>
      {/* <div>
        <h1>{translate('login')}</h1>
        <p>{translate('UserIndex.register.loginMessage')}</p>
        <a className="btn" href="/.login">{translate('login')}</a>
      </div>

      <div className="block forgotPassword">
        <Composer
          value={{'@type': 'ResetPasswordAction'}}
          schema={schema}
          submit={data => emitter.emit('submit', {url: '/user/password/reset', data})}
          getLabel={value => translate(value)}
          submitLabel={translate('UserIndex.register.resetPassword')}
        />
      </div>

      <div className="block">
        <Composer
          value={{'@type': 'RegisterAction'}}
          schema={schema}
          submit={data => emitter.emit('submit', {url: '/user/register', data})}
          getLabel={value => translate(value)}
          submitLabel={translate('UserIndex.register.register')}
        />
      </div> */}
      {/* <Form action="https://httpbin.org/get">
        <Fieldset property="foo">
          <List property="bagga" defaultValue={{}}>
            <Fieldset>
              <Input property="fone" />
              <Input property="ftwo" />
              <List property="sdflkjsdlkfjsdf" defaultValue={''}>
                <Input />
              </List>
            </Fieldset>
          </List>
          <Fieldset property="bar">
            <div>
              <h1>I'm in a div</h1>
              <Input type="checkbox" property="bam" />
            </div>
          </Fieldset>
        </Fieldset>
      </Form> */}
      <Builder schema={schema} />
    </FullModal>
  </div>
)

Register.propTypes = {
  translate: PropTypes.func.isRequired,
  emitter: PropTypes.objectOf(PropTypes.any).isRequired,
}

export default withEmitter(withI18n(Register))
