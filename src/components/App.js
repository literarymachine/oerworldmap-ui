import React from 'react'
import PropTypes from 'prop-types'
import 'font-awesome/css/font-awesome.css'
// import PagedCollection from './PagedCollection'
// import WebPage from './WebPage'
import Header from './Header'
import Map from './Map'
import Columns from './Columns'
import NotificationWelcome from './NotificationWelcome'
import ActionButtons from './ActionButtons'

// const components = {
//   'PagedCollection': PagedCollection,
//   'WebPage': WebPage
// }

const App = ({data}) => (
  <main className='main'>

    <Header />

    <div className='content'>

      <Map />

      <Columns />

      {/* const Component = components[data['@type']]
      return <Component {...data} /> */}

      <NotificationWelcome data={[]} />

      <ActionButtons />

    </div>
  </main>
)

App.propTypes = {
  data: PropTypes.object.isRequired
}

export default App
