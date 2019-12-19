/* global FormData */
/* global Event */
/* global localStorage */

import React from 'react'
import PropTypes from 'prop-types'
import Tooltip from 'rc-tooltip'

import '../styles/components/Filters.pcss'

import withEmitter from './withEmitter'
import withI18n from './withI18n'
import DropdownFilter from './DropdownFilter'
import ButtonFilter from './ButtonFilter'
import ConceptFilter from './ConceptFilter'
import ShareExport from './ShareExport'

import { clearForm } from '../common'

const onSubmit = (e, emitter) => {
  emitter.emit('hideOverlay')
  const current = e.target.htmlFor
  e.preventDefault()
  const form = e.target.parentElement.form || e.target.form || e.target
  const formData = new FormData(form)
  if (formData.get('filter.about.@type') !== 'Event') {
    formData.delete('filter.about.startDate.GTE')
  }
  const parameters = [...formData.entries()]
    .filter(p => !!p[1])
    .filter(p => !p.includes(current && current.split(':')[1]))
    .map(p => `${encodeURIComponent(p[0])}=${encodeURIComponent(p[1])}`).join('&')

  emitter.emit('navigate', `?${parameters}`)
}

const onReset = (e) => {
  const form = e.target.parentElement.form || e.target.form || e.target
  e.preventDefault()
  clearForm(form)
  form.dispatchEvent(new Event('submit'))
}

const primaryFilters = [
  {
    name: 'sterms#about.@type',
    filter: 'filter#about.@type',
    type: 'button',
    order: ['Organization', 'Service', 'Person', 'Project', 'Event', 'Article', 'Product', 'WebPage', 'Policy'],
    translate: true,
  },
]

const subFilters = [
  {
    name: 'sterms#about.keywords',
    filter: 'filter#about.keywords',
    type: 'dropdown',
    icon: 'tag',
  },
  {
    name: 'sterms#about.award',
    filter: 'filter#about.award',
    translate: true,
    icon: 'trophy',
    order: (array, translate) => array
      .sort((a, b) => translate(a.key).localeCompare(translate(b.key))),
  },
]

const secondaryFilters = [
  {
    name: 'sterms#about.availableChannel.availableLanguage',
    filter: 'filter#about.availableChannel.availableLanguage',
    translate: true,
  },
  {
    name: 'sterms#about.primarySector.@id',
    filter: 'filter#about.primarySector.@id',
    type: 'concepts',
    scheme: require('../json/sectors.json'),
    translate: true,
  },
  {
    name: 'sterms#about.secondarySector.@id',
    filter: 'filter#about.secondarySector.@id',
    type: 'concepts',
    scheme: require('../json/sectors.json'),
    translate: true,
  },
  {
    name: 'sterms#about.audience.@id',
    filter: 'filter#about.audience.@id',
    type: 'concepts',
    scheme: require('../json/isced-1997.json'),
    translate: true,
  },
  {
    name: 'sterms#about.about.@id',
    filter: 'filter#about.about.@id',
    type: 'concepts',
    scheme: require('../json/esc.json'),
    translate: true,
  },
  {
    name: 'sterms#about.license.@id',
    filter: 'filter#about.license.@id',
    type: 'concepts',
    scheme: require('../json/licenses.json'),
    translate: true,
  },
  {
    name: 'sterms#about.activityField.@id',
    filter: 'filter#about.activityField.@id',
    type: 'concepts',
    scheme: require('../json/activities.json'),
    translate: true,
  },
]

class Filters extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      extended: Object.keys(props.filters).some(
        v => secondaryFilters.map(f => f.name).includes(v),
      ),
      filtersCollapsed: false,
      showPins: props.initPins,
    }

    this.sizes = [20, 50, 100, 200]

    if (!this.sizes.includes(props.size) && props.size > -1) {
      this.sizes.push(props.size)
      this.sizes = this.sizes.sort((a, b) => a - b)
    }

    this.getFilter = this.getFilter.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const { extended } = this.state

    this.setState({
      extended: Object.keys(nextProps.filters).some(
        v => secondaryFilters.map(f => f.name).includes(v),
      ) || extended,
    })
  }

  getFilter(filterDef) {
    const { aggregations, filters, translate } = this.props

    const [, aggField] = filterDef.name.split('#')
    const aggregation = aggregations['global#facets']['filter#filtered'][filterDef.filter]
      && aggregations['global#facets']['filter#filtered'][filterDef.filter][filterDef.name]
      && aggregations['global#facets']['filter#filtered'][filterDef.filter][filterDef.name].buckets.length
      ? aggregations['global#facets']['filter#filtered'][filterDef.filter][filterDef.name] : null
    const filter = filters[aggField] || []
    if (!aggregation) {
      return
    }
    switch (filterDef.type) {
    case 'button':
      return (
        <ButtonFilter
          key={filterDef.name}
          aggregation={aggregation}
          filter={filter}
          submit={onSubmit}
          order={filterDef.order}
          filterName={`filter.${aggField}`}
        />
      )
    case 'concepts':
      return (
        <ConceptFilter
          key={filterDef.name}
          concepts={filterDef.scheme.hasTopConcept}
          aggregation={aggregation}
          filter={filter}
          filterName={`filter.${aggField}`}
          submit={onSubmit}
        />
      )
    case 'dropdown':
    default:
      return (
        <DropdownFilter
          key={filterDef.name}
          icon={filterDef.icon}
          buckets={Object.prototype.hasOwnProperty.call(filterDef, 'order')
            ? filterDef.order(aggregation.buckets, translate)
            : aggregation.buckets}
          filter={filter}
          filterName={`filter.${aggField}`}
          submit={onSubmit}
          translate={translate}
          translateItems={filterDef.translate ? translate : undefined}
        />
      )
    }
  }

  render() {
    const {
      filters, sort, translate, query, emitter,
      aggregations, totalItems, size, _self, _links, view, embedValue, country, region,
    } = this.props
    const { extended, filtersCollapsed, showPins } = this.state

    const filter = filters && filters['about.@type'] || false
    const hasFilters = (Object.keys(filters).length > 0) || query

    let searchPlaceholder = translate('search.entries')
    if (country) {
      (filters && Object.keys(filters).includes('about.@type'))
        ? searchPlaceholder = translate('search.entries.country.filter', {
          country: translate(region ? `${country}.${region}` : country),
          filter: translate(filters['about.@type'][0]).toLowerCase(),
        })
        : searchPlaceholder = translate('search.entries.country', { country: translate(region ? `${country}.${region}` : country) })
    } else if (filters && Object.keys(filters).includes('about.@type')) {
      if (filters['about.@type'][0] === 'Policy') {
        searchPlaceholder = translate('search.entries.filter.policy')
      } else {
        searchPlaceholder = translate('search.entries.filter', {
          filter: translate(filters['about.@type'][0]).toLowerCase(),
        })
      }
    }

    let sortName
    const sortType = sort && sort.split(':').shift()
    let sortOder = 'ASC'

    if (sortType === 'about.name.en.sort') {
      sortName = translate('ClientTemplates.filter.alphabetical')
    } else if (sortType === 'lighthouse_count') {
      sortName = translate('ClientTemplates.filter.lighthouseCount')
      sortOder = 'DESC'
    } else if (sortType === 'like_count') {
      sortName = translate('ClientTemplates.filter.likeCount')
      sortOder = 'DESC'
    } else if (query) {
      sortName = translate('ClientTemplates.filter.relevance')
    } else {
      sortName = translate('ClientTemplates.filter.dateCreated')
      sortOder = 'DESC'
    }

    return (
      <nav className="Filters">

        <form
          onSubmit={evt => onSubmit(evt, emitter)}
          onReset={evt => onReset(evt)}
        >
          <div className={`FiltersControls ${filtersCollapsed ? ' filtersCollapsed' : ''}`}>

            <div className="firstRow">
              <div className="filterSearch">
                <input
                  type="text"
                  name="q"
                  defaultValue={query}
                  key={query}
                  placeholder={searchPlaceholder}
                />

                <button
                  type="submit"
                  className={!hasFilters ? 'withoutFilters' : null}
                >
                  <i
                    aria-hidden="true"
                    className="fa fa-search"
                    title="Search"
                  />
                </button>

                {hasFilters && (
                  <button
                    type="reset"
                    className="clearFilter"
                    title={translate('ClientTemplates.filter.clear')}
                  >
                    &times;
                  </button>
                )}

                <noscript>
                  <div className="search-bar">
                    <input type="submit" className="btn" />
                  </div>
                </noscript>
              </div>

              <Tooltip
                overlay={(
                  showPins ? translate('Hide pins') : translate('Show pins')
                )}
                placement="top"
                mouseEnterDelay={0.2}
              >
                <button
                  className={`togglePins${showPins ? ' checked' : ''}`}
                  onClick={() => {
                    localStorage.setItem('showPins', !showPins)
                    emitter.emit('showFeatures', !showPins)
                    this.setState({ showPins: !showPins })
                  }}
                  title={translate(showPins ? 'Hide pins' : 'Show pins')}
                >
                  <i aria-hidden="true" className="fa fa-map-marker" />
                </button>
              </Tooltip>
            </div>

            <div className="filterType primary">
              {primaryFilters.map(filterDef => this.getFilter(filterDef))}
            </div>

            <div className="subFilters">
              {subFilters.map(filterDef => this.getFilter(filterDef))}

              {secondaryFilters.map(f => f.name).some(
                v => aggregations[v] && aggregations[v].buckets.length,
              ) && (
                <div className="showMore">
                  <button
                    type="button"
                    className={`btn expand${extended ? ' active' : ''}`}
                    onClick={(e) => {
                      e.preventDefault()
                      this.setState({ extended: !extended })
                    }}
                  >
                    {extended
                      ? translate('ClientTemplates.filter.hide')
                      : translate('ClientTemplates.filter.show')
                    }
                  </button>
                </div>
              )}

            </div>

            <div
              className={`filterType secondary${extended ? '' : ' collapsed'}`}
            >
              {secondaryFilters.map(filterDef => this.getFilter(filterDef))}
            </div>

            {Object.keys(filters).some(name => name !== 'about.@type' && name !== 'about.startDate.GTE') && (
              <div className="selectedFilters">
                <hr />
                {Object.keys(filters).filter(name => name !== 'about.@type' && name !== 'about.startDate.GTE').map(filterGroup => (
                  filters[filterGroup].map(filter => (
                    <div key={`filterSelected.${filterGroup}.${filter}`} className="tagFilter">
                      <input
                        type="checkbox"
                        name={`filter.${filterGroup}`}
                        id={`filterSelected.${filterGroup}${filter}`}
                        onChange={(e) => {
                          onSubmit(e, emitter)
                        }}
                        value={filter}
                        defaultChecked
                      />
                      <label
                        htmlFor={`filterSelected.${filterGroup}${filter}`}
                        onKeyDown={(e) => {
                          if (e.keyCode === 13) {
                            e.target.click()
                          }
                        }}
                        tabIndex="0"
                        role="button"
                        title={translate(`filter.${filterGroup}`)}
                      >
                        {translate(filter)}
                      </label>
                    </div>
                  ))
                ))}
              </div>
            )}

          </div>

          <div
            className={`filtersCollapsedButton ${filtersCollapsed ? 'collapsed' : ''}`}
            title={filtersCollapsed ? translate('Show filters') : translate('Hide filters')}
          >
            <i
              aria-hidden="true"
              className={`fa fa-${!filtersCollapsed ? 'chevron-up' : 'chevron-down'}`}
              onClick={() => this.setState({ filtersCollapsed: !filtersCollapsed })}
            />
            <hr />

          </div>

          <div className="sortContainer">
            <section className="listOptions">
              <div>
                {(filter === false || !filter.includes('Event')) && (
                  totalItems >= 20 && (
                    <span>
                      <span className="arrowWrapper">
                        <select onChange={e => onSubmit(e, emitter)} className="styledSelect totalSelect" name="size" value={size}>
                          {this.sizes.map(number => (
                            number >= 0
                            && <option key={number} value={number}>{number}</option>
                          ))}
                          <option value="-1">{translate('Pagination.all')}</option>
                        </select>
                      </span>
                      {translate('Pagination.of')}
                      &nbsp;
                    </span>
                  )
                )}
                <span className="counter">
                  <span>{totalItems}</span>
                  &nbsp;
                  {translate('ResourceIndex.index.results')}
                </span>
                {!(filters['about.@type'] && filters['about.@type'].includes('Event')) && (
                  <span>
                    ,&nbsp;
                    {translate('ResourceIndex.index.orderedBy')}
                    <span className="arrowWrapper">
                      <select
                        name="sort"
                        value={sortType ? `${sortType}:${sortOder}` : ''}
                        className="styledSelect"
                        style={{
                          width: `${(sortName.length + 3) * 1.1}ex `,
                          minWidth: '70px',
                        }}
                        onChange={(evt) => {
                          evt.target.style.width = `${(evt.target.options[evt.target.selectedIndex].text.length + 3) * 1.1}ex`
                          onSubmit(evt, emitter)
                        }}
                      >
                        {query ? (
                          <option value="">{translate('ClientTemplates.filter.relevance')}</option>
                        ) : (
                          <option value="">{translate('ClientTemplates.filter.dateCreated')}</option>
                        )}
                        {query
                          && <option value="dateCreated:DESC">{translate('ClientTemplates.filter.dateCreated')}</option>
                        }
                        <option value="about.name.en.sort:ASC">{translate('ClientTemplates.filter.alphabetical')}</option>
                        <option value="lighthouse_count:DESC">{translate('ClientTemplates.filter.lighthouseCount')}</option>
                        <option value="like_count:DESC">{translate('ClientTemplates.filter.likeCount')}</option>
                      </select>
                    </span>
                  </span>
                ) || (
                  <div>
                    <input
                      type="checkbox"
                      name="filter.about.startDate.GTE"
                      value="1970"
                      id="filter.about.startDate.GTE"
                      checked={filters['about.startDate.GTE'] && filters['about.startDate.GTE'].includes('1970')}
                      onChange={e => onSubmit(e, emitter)}
                    />
                    &nbsp;
                    {translate('calendar.show.past')}
                  </div>
                )}
              </div>
              <ShareExport
                _self={_self}
                _links={_links}
                view={view}
                embedValue={embedValue}
              />
            </section>
          </div>

        </form>

      </nav>
    )
  }
}

Filters.propTypes = {
  query: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
  filters: PropTypes.objectOf(PropTypes.any).isRequired,
  aggregations: PropTypes.objectOf(PropTypes.any).isRequired,
  emitter: PropTypes.objectOf(PropTypes.any).isRequired,
  translate: PropTypes.func.isRequired,
  totalItems: PropTypes.number.isRequired,
  view: PropTypes.string,
  _self: PropTypes.string.isRequired,
  _links: PropTypes.objectOf(PropTypes.any).isRequired,
  sort: PropTypes.string,
  embedValue: PropTypes.string,
  country: PropTypes.string,
  region: PropTypes.string,
  initPins: PropTypes.bool.isRequired,
}

Filters.defaultProps = {
  view: null,
  sort: '',
  embedValue: null,
  country: null,
  region: null,
}

export default withEmitter(withI18n(Filters))
