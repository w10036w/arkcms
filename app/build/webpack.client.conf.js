const path = require('path')
const glob = require('glob')
const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.base.conf')
const SWPrecachePlugin = require('sw-precache-webpack-plugin')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
// TODO: uncomment it when want to see visualizatiion
// var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const config = merge(base, {
  entry: {
    app: './src/entry-client.js'
  },
  resolve: {
    alias: {
      'create-api': './create-api-client.js'
    }
  },
  plugins: [
    // strip dev-only code in Vue source
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_ENV': '"client"'
    }),
    // extract vendor chunks for better caching
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        // a module is extracted into the vendor chunk if...
        return (
          // it's inside node_modules
          /node_modules/.test(module.context) &&
          // and not a CSS file (due to extract-text-webpack-plugin limitation)
          !/\.css$/.test(module.request)
        )
      }
    }),
    // extract webpack runtime & manifest to avoid vendor chunk hash changing
    // on every build.
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest'
    }),
    new VueSSRClientPlugin(),
    // TODO: uncomment it when want to see visualizatiion
    // new BundleAnalyzerPlugin(),
  ]
})

// TODO: add new routing if SW precache needed
if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    // auto generate service worker
    new SWPrecachePlugin({
      cacheId: 'arknodejs',
      filename: 'service-worker.js',
      minify: true,
      dontCacheBustUrlsMatching: /./,
      staticFileGlobsIgnorePatterns: [/\.map$/, /\.json$/],
      runtimeCaching: [
        {
          // note that this pattern will cache ajax request
          urlPattern: /(.+\/[^\.]*$)/,
          handler: 'networkFirst',
          options: {
            cache: {
              maxEntries: 30,
              name: 'arknodejs-runtime-cache'
            }
          }
        },
        {
          urlPattern: /\.(png|jpe?g|webp|gif)/,
          handler: 'cacheFirst',
          options: {
            cache: {
              maxEntries: 20,
              name: 'arknodejs-image-cache'
            }
          }
        },
        // {
        //   urlPattern: '/',
        //   handler: 'networkFirst'
        // },
      ]
    })
  )
}

module.exports = config
