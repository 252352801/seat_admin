// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import store from './store'
import rendered from '@/directives/rendered'
import clickGoBack from '@/directives/click-go-back'
import 'element-ui/lib/theme-chalk/index.css'
import pagodaComponents from 'pagoda-ui'
import 'pagoda-ui/src/theme/theme1.scss'
import 'pagoda-ui/src/theme/ui-reset.scss'
import './style/app.scss'
import api from '@/api'
import vars from './style/vars.scss'
import { insertActionsAfterValidating } from '@/utils/element-ui-utils'
console.log(vars)
// import * as api from './pont/services'
Vue.config.productionTip = false
// element-ui表单验证后处理
insertActionsAfterValidating(ElementUI.Form)
Vue.use(ElementUI, { size: 'small' })
Vue.directive('rendered', rendered)
Vue.directive('click-go-back', clickGoBack)
Vue.use(pagodaComponents)
Vue.use({
  install (vue) {
    vue.prototype['$api'] = api
  }
})
if (process.env.NODE_ENV === 'development') {
  if (location.search.match(/[?&]mock=true/)) {
    require('@/mock')// 开发环境url里mock=true时开启mock
  }
}
/* eslint-disable no-new */
const app = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
app.$pagoda.form.baseFormWidth = '50%'
