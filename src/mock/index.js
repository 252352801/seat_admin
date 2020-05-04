import Router from 'vue-router'
import './app-manage'
import './cd'
import './resource'
const push = Router.prototype.push
const replace = Router.prototype.replace
function mixinMock (args) {
  return [{
    ...args[0],
    query: {
      ...args[0].query,
      mock: true
    }
  }, ...args.slice(1)]
}
Router.prototype.push = function (...args) {
  if (args[0] && typeof args[0] === 'object') {
    push.apply(this, mixinMock(args))
  }
}
Router.prototype.replace = function (...args) {
  if (args[0] && typeof args[0] === 'object') {
    replace.apply(this, mixinMock(args))
  }
}
