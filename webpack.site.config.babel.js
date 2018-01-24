import path from 'path'
import webpack from 'webpack'
import merge from 'webpack-merge'
import StyleLintPlugin from 'stylelint-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import UglifyJSPlugin from 'uglifyjs-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import env from './config'

const TARGET = process.env.npm_lifecycle_event

let Config = {
  context: path.join(__dirname, 'src'),
  entry: [
    'babel-polyfill',
    './site.js'
  ],
  output: {
    path: path.join(__dirname, 'docs'),
    publicPath: `http://${env.host}:${env.port}/`,
    filename: 'assets/js/bundle.js'
  },
  module: {
    exprContextCritical: false,
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },

      {
        test: /\.(css|pcss)$/,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules/normalize.css'),
          path.resolve(__dirname, 'node_modules/font-awesome'),
          path.resolve(__dirname, 'node_modules/source-sans-pro'),
          path.resolve(__dirname, 'node_modules/mapbox-gl/dist'),
        ],
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                sourceMap: true,
                minimize: true,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
              },
            },
          ],
        })
      },

      {
        test: /\.(png|svg|jpg|gif|ico)$/,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: 'assets/img/'
          }
        }
      },

      {
        test: /\.(woff|woff2|ttf|eot|otf)$/,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: 'assets/fonts/'
          }
        }
      }
    ]
  },

  devtool: 'source-map',

  plugins: [
    new ExtractTextPlugin("assets/css/styles.css"),
    // new CopyWebpackPlugin([
    //   { from: 'assets', to: 'assets' },
    // ])
  ]

}

const WebpackConfig = Config
export default WebpackConfig
