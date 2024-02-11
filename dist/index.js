
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./next-rocket-kit.cjs.production.min.js')
} else {
  module.exports = require('./next-rocket-kit.cjs.development.js')
}
