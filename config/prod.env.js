'use strict'
module.exports = {
  NODE_ENV: `"${process.env.NODE_ENV||'prodction'}"`,
  API_SUB_PATH: `"${process.env.API_SUB_PATH||''}"`,
  ENV:`"${process.env.ENV||''}"`
}
