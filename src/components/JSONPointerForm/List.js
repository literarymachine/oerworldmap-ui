import React from 'react'
import PropTypes from 'prop-types'

import ListItem from './ListItem'
import withFormData from './withFormData'

class List extends React.Component {

  constructor(props) {
    super(props)
    this.insert = null
  }

  componentDidUpdate() {
    this.insert = null
  }

  render() {
    return (
      <ul>
        {this.props.value.map((item, index) => (
          <ListItem property={index} key={index}>
            {React.cloneElement(this.props.children)}
          </ListItem>
        ))}
        {this.insert ? this.insert : (
          <li>
            <button
              type="button"
              onClick={() => {
                this.insert = (
                  <ListItem property={this.props.value.length} key={this.props.value.length}>
                    {React.cloneElement(this.props.children)}
                  </ListItem>
                )
                this.forceUpdate()
              }}
            >
              Add {this.props.name}
            </button>
          </li>
        )}
      </ul>
    )
  }

}

List.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(PropTypes.any),
  children: PropTypes.element.isRequired
}

List.defaultProps = {
  value: []
}

export default withFormData(List)
