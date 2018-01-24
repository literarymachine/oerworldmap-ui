import React from 'react'
import ReactDOM from 'react-dom'

import Api from './api'
import './styles/main.pcss'
import './styles/static.pcss'
import './styles/components/Header.pcss'
import ItemsCount from './components/ItemsCount'

(function () {
  document.addEventListener('DOMContentLoaded', async () => {
    const api = new Api({host: 'oerworldmap.local', port: '80'})
    const data = await api.get('/resource/?size=0')
    ReactDOM.render(
      <ItemsCount buckets={data.aggregations['about.@type'].buckets} />,
      document.getElementById('inject-stats')
    )
  })
})()
