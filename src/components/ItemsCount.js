import React from 'react'
import PropTypes from 'prop-types'
import Icon from './Icon'

import '../styles/ItemsCount.pcss'

const ItemsCount = ({buckets}) => (

  <div className="numbersTable">
    {buckets.map(bucket => (
      <div key={bucket.key}>
        <a href={`/resource/?filter.about.@type=${bucket.key}`}>
          <Icon type={bucket.key} />
          <br />
          <span className="name">{bucket.key}</span>
          <br />
          <span className="count">{bucket.doc_count}</span>
        </a>
      </div>
    ))}
  </div>

)

ItemsCount.propTypes = {
  buckets: PropTypes.arrayOf(PropTypes.any).isRequired
}

export default ItemsCount
