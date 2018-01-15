import React from 'react'
import PropTypes from 'prop-types'
import Icon from './Icon'
import Link from './Link'

import '../styles/components/ItemList.pcss'

import translate from './translate'
import withEmitter from './withEmitter'

const ItemList = ({ translate, moment, emitter, listItems, selected }) => (
  <ul className="ItemList" >
    {listItems.map(listItem => (
      <li
        id={listItem.about['@id']}
        key={listItem.about['@id']}
        onMouseEnter={() => {
          emitter.emit('hoverPoint', { id: listItem.about["@id"] })
        }}
        onMouseLeave={() => {
          emitter.emit('hoverPoint', { id: '' })
        }}
      >
        {listItem.about['@type'] === 'Event' &&
        listItem.about.startDate
          ? (
            <Link className="item" href={'#' + listItem.about['@id']}>
              <div className="sheet">
                <span>{moment(listItem.about.startDate).format('D')}</span>
                <span>{moment(listItem.about.startDate).format('ddd')}</span>
              </div>
              <span>
                {translate(listItem.about.name) || listItem.about['@id']}<br />
                {moment(listItem.about.startDate).format('dddd, D. MMMM')} —&nbsp;
                {listItem.about.location &&
                  listItem.about.location.address &&
                  (`${listItem.about.location.address.addressLocality}, ${listItem.about.location.address.addressCountry}`)
                }
              </span>
            </Link>
          ) : (
            <Link className="item" href={'#' + listItem.about['@id']}>
              <Icon type={listItem.about['@type']} />
              <span>{translate(listItem.about.name) || listItem.about['@id']}</span>
            </Link>
          )}
      </li>
    ))}
  </ul>
)


ItemList.propTypes = {
  translate: PropTypes.func.isRequired,
  moment: PropTypes.func.isRequired,
  emitter: PropTypes.objectOf(PropTypes.any).isRequired,
  listItems: PropTypes.arrayOf(PropTypes.any).isRequired,
  selected: PropTypes.string.isRequired
}

export default withEmitter(translate(ItemList))
