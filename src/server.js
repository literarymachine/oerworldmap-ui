import { renderToString } from 'react-dom/server'
import path from 'path'
import express from 'express'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import template from './views/index'
import webpackConfig from '../webpack.config.babel'
import router from './router'
import Api from './api'

import Config, { mapboxConfig, apiConfig } from '../config'

const server = express()
const api = new Api(apiConfig)

server.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

if (process.env.NODE_ENV === 'development') {
  const compiler = webpack(webpackConfig)

  server.use([

    webpackDevMiddleware(compiler, {
      filename: webpackConfig.output.filename,
      hot: true,
      overlay: true,
      stats: {
        colors: true
      }
    }),

    webpackHotMiddleware(compiler, {
      log: console.log
    })

  ])
}

server.use(express.static(path.join(__dirname, '/../dist')))

server.get(/^(.*)$/, (req, res) => {
  const defaultLanguage = 'en'
  const supportedLanguages = [ 'en', 'de', 'es' ]
  const requestedLanguages = req.headers['accept-language']
    ? req.headers['accept-language'].split(',').map(language => {
      return language.split(';')[0]
    }) : [defaultLanguage]
  const locales = requestedLanguages.filter(language => {
    return supportedLanguages.includes(language)
  })
  if (!locales.includes(defaultLanguage)) {
    locales.push(defaultLanguage)
  }
  const authorization = req.get('authorization')
  const [user] = authorization
    ? Buffer.from(authorization.split(" ").pop(), "base64").toString("ascii").split(":") : []
  const context = { locales, authorization, mapboxConfig }
  //TODO: use actual request method
  router(api).route(req.path, context).get(req.query).then(({title, data, render, err}) => {
    res.send(template({
      env: process.env.NODE_ENV,
      body: renderToString(render(data)),
      initialState: JSON.stringify({apiConfig, locales, mapboxConfig, data, user, err})
        .replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029"),
      title
    }))
  })
})

server.listen(Config.port, Config.host, function () {
  console.info(`oerworldmap-ui server listening on http://${Config.host}:${Config.port}`)
})
