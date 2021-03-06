import React from 'react'
import PropTypes from 'prop-types'

import withI18n from './withI18n'
import Link from './Link'
import Icon from './Icon'
import FullModal from './FullModal'
import withEmitter from './withEmitter'
import { triggerClick } from '../common'
import '../styles/components/Country.pcss'

class Country extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showCountryChampion: true,
      showReports: false,
      showStatistics: false,
      showKibanaStatistics: false,
      showCountry: false,
      minimizeCountry: false,
    }
    this.showCountry = this.showCountry.bind(this)
  }


  componentDidMount() {
    const { emitter } = this.props
    emitter.on('showCountry', this.showCountry)
  }

  componentWillUnmount() {
    const { emitter } = this.props
    emitter.off('showCountry', this.showCountry)
  }

  showCountry(showCountry) {
    this.setState({ showCountry })
  }

  render() {
    const {
      countryData, countryChampions, regionData, regionalChampions, iso3166, translate, region,
    } = this.props
    const {
      showCountryChampion, showRegionalChampion, showReports, showStatistics,
      showKibanaStatistics, showCountry, minimizeCountry,
    } = this.state
    const statsQuery = `feature.properties.location.address.addressCountry:${iso3166}`
      .concat(region ? ` AND feature.properties.location.address.addressRegion:${iso3166}.${region}` : '')

    return (
      <React.Fragment>
        <div className={`Country${showCountry ? ' showCountry' : ''}${minimizeCountry ? ' minimizeCountry' : ''}`}>
          <div className="countryHeader">
            <img
              className="countryFlag"
              src={`https://lipis.github.io/flag-icon-css/flags/4x3/${iso3166.toLowerCase()}.svg`}
              alt={`Flag for ${translate(iso3166)}`}
            />
            {region ? <h2>{translate(`${iso3166}.${region}`)}</h2> : <h2>{translate(iso3166)}</h2>}
          </div>

          {countryChampions
            ? (
              <div className="countryChampion">
                <h3
                  onKeyDown={triggerClick}
                  tabIndex="0"
                  role="button"
                  onClick={() => this.setState({ showCountryChampion: !showCountryChampion })}
                >
                  <span>{translate('CountryIndex.read.countryChampion')}</span>
                  &nbsp;
                  <i aria-hidden="true" className={`fa fa-${showCountryChampion ? 'minus' : 'plus'}`} />
                </h3>

                <div className={`countryChampionContainer ${showCountryChampion ? '' : 'collapsed'}`}>
                  {countryChampions.map(champion => (
                    <div className="user" key={champion._source.about['@id']}>
                      {champion._source.about.image ? (
                        <Link href={`/resource/${champion._source.about['@id']}`}>
                          <div className="frame">
                            <img
                              className={champion._source.about['@type']}
                              src={champion._source.about.image}
                              alt={translate(champion._source.about.name)}
                              onLoad={(e) => {
                                if (e.target.complete) {
                                  e.target.classList.add('visible')
                                }
                              }}
                            />
                            <Icon type={champion._source.about['@type']} />
                          </div>
                        </Link>
                      ) : (
                        <div className="frame">
                          <Icon type={champion._source.about['@type']} />
                        </div>
                      )}
                      <div className="text">
                        <Link href={`/resource/${champion._source.about['@id']}`}>
                          {translate(champion._source.about.name)}
                        </Link>
                        <br />
                        {champion._source.about.email && (
                          <a href={`mailto:${champion._source.about.email}`}>
                            {champion._source.about.email}
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="countryChampion">
                <h3
                  onKeyDown={triggerClick}
                  tabIndex="0"
                  role="button"
                  onClick={() => this.setState({ showCountryChampion: !showCountryChampion })}
                >
                  <span>{translate('CountryIndex.read.countryChampion')}</span>
                  &nbsp;
                  <i aria-hidden="true" className={`fa fa-${showCountryChampion ? 'minus' : 'plus'}`} />
                </h3>

                <div className={`countryChampionContainer ${showCountryChampion ? '' : 'collapsed'}`}>
                  <div className="user">
                    <div className="frame">
                      <i aria-hidden="true" className="fa fa-user" />
                    </div>
                    <div
                      className="text"
                      dangerouslySetInnerHTML={{
                        __html: translate('CountryIndex.read.noChampion', {
                          country: translate(iso3166),
                        }),
                      }}
                    />
                  </div>
                </div>
              </div>
            )
          }

          {region && (
            <div className="countryChampion">

              {regionalChampions
                ? (
                  <React.Fragment>
                    <h3
                      onKeyDown={triggerClick}
                      tabIndex="0"
                      role="button"
                      onClick={() => this.setState({ showRegionalChampion: !showRegionalChampion })}
                    >
                      <span>{translate('CountryIndex.read.regionalChampion')}</span>
                      &nbsp;
                      <i aria-hidden="true" className={`fa fa-${showRegionalChampion ? 'minus' : 'plus'}`} />
                    </h3>

                    <div className={`countryChampionContainer ${showRegionalChampion ? '' : 'collapsed'}`}>
                      {regionalChampions.map(champion => (
                        <div className="user" key={champion._source.about['@id']}>
                          {champion._source.about.image ? (
                            <Link href={`/resource/${champion._source.about['@id']}`}>
                              <div className="frame">
                                <img
                                  className={champion._source.about['@type']}
                                  src={champion._source.about.image}
                                  alt={translate(champion._source.about.name)}
                                  onLoad={(e) => {
                                    if (e.target.complete) {
                                      e.target.classList.add('visible')
                                    }
                                  }}
                                />
                                <Icon type={champion._source.about['@type']} />
                              </div>
                            </Link>
                          ) : (
                            <div className="frame">
                              <Icon type={champion._source.about['@type']} />
                            </div>
                          )}
                          <div className="text">
                            <Link href={`/resource/${champion._source.about['@id']}`}>
                              {translate(champion._source.about.name)}
                            </Link>
                            <br />
                            {champion._source.about.email && (
                              <a href={`mailto:${champion._source.about.email}`}>
                                {champion._source.about.email}
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <h3
                      onKeyDown={triggerClick}
                      tabIndex="0"
                      role="button"
                      onClick={() => this.setState({ showRegionalChampion: !showRegionalChampion })}
                    >
                      <span>{translate('CountryIndex.read.regionalChampion')}</span>
                      &nbsp;
                      <i aria-hidden="true" className={`fa fa-${showRegionalChampion ? 'minus' : 'plus'}`} />
                    </h3>

                    <div className={`countryChampionContainer ${showRegionalChampion ? '' : 'collapsed'}`}>
                      <div className="user">
                        <div className="frame">
                          <i aria-hidden="true" className="fa fa-user" />
                        </div>
                        <div
                          className="text"
                          dangerouslySetInnerHTML={{
                            __html: translate('CountryIndex.read.noChampion', {
                              country: translate(`${iso3166}.${region}`),
                            }),
                          }}
                        />
                      </div>
                    </div>
                  </React.Fragment>
                )
              }
            </div>
          )}

          {countryData
          && countryData['filter#reports']['top_hits#country_reports']
          && countryData['filter#reports']['top_hits#country_reports'].hits.hits.length > 0 && (
            <div className="countryReports">
              <h3
                onKeyDown={triggerClick}
                tabIndex="0"
                role="button"
                onClick={() => this.setState({ showReports: !showReports })}
              >
                <span>{translate('CountryIndex.read.countryReports')}</span>
                &nbsp;
                <i aria-hidden="true" className={`fa fa-${showReports ? 'minus' : 'plus'}`} />
              </h3>

              <div className={`resourcesContainer ${showReports ? '' : 'collapsed'}`}>
                {countryData['filter#reports']['top_hits#country_reports'].hits.hits
                  .sort((a, b) => a._source.about.dateCreated < b._source.about.dateCreated)
                  .map(report => (
                    <div className="resource" key={report._source.about['@id']}>
                      <i aria-hidden="true" className="fa fa-book" />
                      <div className="text">
                        <Link href={`/resource/${report._source.about['@id']}`}>
                          {translate(report._source.about.name)}
                        </Link>
                      </div>
                    </div>
                  ))}

              </div>
            </div>
          )}

          {((!region && countryData
          && countryData['sterms#by_type']
          && countryData['sterms#by_type'].buckets
          && countryData['sterms#by_type'].buckets.length)
          || (region && regionData
          && regionData['sterms#by_type']
          && regionData['sterms#by_type'].buckets
          && regionData['sterms#by_type'].buckets.length)) && (
            <div className="statistics">
              <h3
                onKeyDown={triggerClick}
                tabIndex="0"
                role="button"
                onClick={() => this.setState({ showStatistics: !showStatistics })}
              >
                <span>{translate('CountryIndex.read.statistics')}</span>
                &nbsp;
                <i
                  onClick={() => this.setState({ showStatistics: !showStatistics })}
                  aria-hidden="true"
                  className={`fa fa-${showStatistics ? 'minus' : 'plus'}`}
                />
              </h3>

              <div className={`statisticsContainer ${showStatistics ? '' : 'collapsed'}`}>
                <ul className="buckets">
                  {(region
                    ? regionData['sterms#by_type'].buckets
                    : countryData['sterms#by_type'].buckets)
                    .map(type => (
                      <li key={type.key}>
                        <span className="icon">
                          <Icon type={type.key} />
                        </span>
                        <span className="type">
                          {translate(type.key)}
                        </span>
                        <span>{type.doc_count}</span>
                      </li>
                    ))
                  }
                </ul>
                <div className="more">
                  <button
                    type="button"
                    onKeyDown={triggerClick}
                    onClick={() => this.setState({ showKibanaStatistics: !showKibanaStatistics })}
                  >
                    {translate('Show detailed statistics')}
                  </button>
                </div>
              </div>

            </div>
          )}

          <i
            role="presentation"
            className={`minimizeCountryBtn fa fa-${minimizeCountry ? 'plus' : 'minus'}`}
            onClick={() => {
              this.setState({ minimizeCountry: !minimizeCountry })
              console.log('minimize')
            }}
            onKeyDown={triggerClick}
          />

          {region ? (
            <Link href={`/country/${iso3166}`} className="closePage">
              &times;
            </Link>
          ) : (
            <Link href="/resource/" className="closePage">
              &times;
            </Link>
          )}

        </div>
        <FullModal className={`countryStatistics${showKibanaStatistics ? '' : ' hidden'}`}>
          <span
            className="closeModal"
            role="presentation"
            onClick={() => this.setState({ showKibanaStatistics: false })}
          >
            ×
          </span>
          <div className="graphs">
            <div>
              <h2>{translate('about.@type')}</h2>
              <embed type="image/svg+xml" alt={translate('about.@type')} src={`/stats?field=about.@type&q=${statsQuery}`} />
            </div>
            <div>
              <h2>{translate('about.primarySector.@id')}</h2>
              <embed type="image/svg+xml" alt={translate('about.primarySector.@id')} src={`/stats?field=about.primarySector.@id&q=${statsQuery}`} />
            </div>
            <div>
              <h2>{translate('about.license.@id')}</h2>
              <embed type="image/svg+xml" alt={translate('about.license.@id')} src={`/stats?field=about.license.@id&q=${statsQuery}`} />
            </div>
            <div>
              <h2>{translate('about.about.@id')}</h2>
              <embed type="image/svg+xml" alt={translate('about.about.@id')} src={`/stats?field=about.about.@id&include=https://w3id.org/class/esc/n..&q=${statsQuery}`} />
            </div>
            {!region && (
              <>
                <div>
                  <h2>{translate('feature.properties.location.address.addressRegion')}</h2>
                  <embed type="image/svg+xml" alt={translate('feature.properties.location.address.addressRegion')} src={`/stats?field=feature.properties.location.address.addressRegion&q=about.@type:Action AND ${statsQuery}`} />
                </div>
                <div>
                  <h2>{translate('about.location.address.addressRegion')}</h2>
                  <embed type="image/svg+xml" alt={translate('about.location.address.addressRegion')} src={`/stats?field=about.location.address.addressRegion&q=${statsQuery}`} />
                </div>
              </>
            )
            }
          </div>
        </FullModal>
      </React.Fragment>
    )
  }
}

Country.propTypes = {
  countryData: PropTypes.objectOf(PropTypes.any),
  translate: PropTypes.func.isRequired,
  iso3166: PropTypes.string.isRequired,
  emitter: PropTypes.objectOf(PropTypes.any).isRequired,
  region: PropTypes.string,
  countryChampions: PropTypes.arrayOf(PropTypes.object),
  regionalChampions: PropTypes.arrayOf(PropTypes.object),
  regionData: PropTypes.objectOf(PropTypes.any),
}

Country.defaultProps = {
  countryData: null,
  region: null,
  countryChampions: null,
  regionalChampions: null,
  regionData: null,
}

export default withEmitter(withI18n(Country))
