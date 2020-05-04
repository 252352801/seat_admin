'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: `"${process.env.NODE_ENV||'development'}"`,
  API_SUB_PATH: `"${process.env.API_SUB_PATH||''}"`,
  ENV:`"${process.env.ENV||''}"`
})
