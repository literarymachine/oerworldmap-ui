/* global document */
import React from 'react'
import PropTypes from 'prop-types'
import withEmitter from './withEmitter'
import translate from './translate'
import Link from './Link'

import '../styles/components/Header.pcss'

const triggerClick = (e) => {
  if (e.keyCode === 32) {
    e.target.click()
  }
}

class Header extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      showUserMenu: false,
      showMobileMenu: false
    }
    this.handleClick = this.handleClick.bind(this)
  }

  componentDidMount() {
    document.addEventListener("click", this.handleClick)
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleClick)
  }

  handleClick(e) {
    if (e.target !== this.menuBtn)
      this.setState({showUserMenu:false})

    if (e.target !== this.menuToggle)
      this.setState({showMobileMenu:false})
  }

  render() {
    return (
      <header className="Header">
        <nav
          className="menuToggle"
          tabIndex="0"
          role="button"
          onClick={() => {this.setState({showMobileMenu:!this.state.showMobileMenu})}}
          onKeyDown={triggerClick}
          ref={el => this.menuToggle = el}
        >
          <i className="fa fa-bars" />
        </nav>

        <nav className={`mainNav ${this.state.showMobileMenu ? 'show' : '' }`}>
          <Link href="/resource/">
            <h1>OER WORLD MAP</h1>
          </Link>

          <Link href="/resource/" className="mobile">
            Map
          </Link>

          <a
            href="/contribute"
            title={this.props.translate('Header.contribute')}
          >
            {this.props.translate('Header.contribute')}
          </a>
          <a
            href="/about"
            title={this.props.translate('Header.about')}
          >
            {this.props.translate('Header.about')}
          </a>
          <a
            href="/FAQ"
            title={this.props.translate('Header.faq')}
          >
            {this.props.translate('Header.faq')}
          </a>
          <a
            href="https://oerworldmap.wordpress.com/"
            title={this.props.translate('Header.blog')}
            target="_blank"
            rel="noopener noreferrer"
          >
            {this.props.translate('Header.blog')}
          </a>
          <a
            href="/imprint"
            title="Imprint & Privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="mobile"
          >
            Imprint & Privacy
          </a>
          <a
            href="https://www.facebook.com/oerworldmap"
            title="Facebook"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa fa-facebook-official" /> <span className="mobile">Facebook</span>
          </a>
          <a
            href="https://twitter.com/oerworldmap"
            title="Twitter"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa fa-twitter" /> <span className="mobile">Twitter</span>
          </a>
        </nav>

        <nav className="mobileNav" >
          <i className="fa fa-globe" />
        </nav>

        <nav className="userNav">
          <a href="/contribute">
            <h2>{this.props.translate('Header.joinUs')}</h2>
          </a>
          {this.props.user ? (
            <div
              className="menuBtn"
              href="#nothing"
              title={this.props.user.username}
              tabIndex="0"
              role="button"
              onClick={() => {this.setState({showUserMenu:!this.state.showUserMenu})}}
              onKeyDown={triggerClick}
              ref={el => this.menuBtn = el}
            >
              <i className="fa fa-user" />
            </div>
          ) : (
            <Link
              title={this.props.translate('Header.logIn')}
              href="/user/register"
            >
              {this.props.translate('Header.logIn')}
            </Link>
          )}
        </nav>

        {this.state.showUserMenu &&
          <ul className="userMenu">
            <li>
              <Link href={`/resource/${this.props.user.id}`} >My Profile <i className="fa fa-user" /></Link>
            </li>
            <li>
              <Link href="/user/password">Change Password <i className="fa fa-lock" /></Link>
            </li>
            <li>
              <a
                href="/.logout"
                onClick={(e) => {
                  e.preventDefault()
                  this.props.emitter.emit('logout')
                }}
              >
                {this.props.translate('Header.logOut')} <i className="fa fa-sign-out" />
              </a>
            </li>
          </ul>
        }

      </header>
    )
  }
}

Header.propTypes = {
  emitter: PropTypes.objectOf(PropTypes.any).isRequired,
  translate: PropTypes.func.isRequired,
  user: PropTypes.objectOf(PropTypes.any)
}

Header.defaultProps = {
  user: null,
}

export default withEmitter(translate(Header))
