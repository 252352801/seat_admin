'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: `"${process.env.NODE_ENV||'testing'}"`,
  API_SUB_PATH: `"${process.env.API_SUB_PATH||''}"`,
  ENV:`"${process.env.ENV||''}"`
})

