import Vue from 'vue'
import Vuex from 'vuex'
import global from './global'
import console from '@/pages/console/console.store'
import home from '@/pages/home/home.store'
import resourceList from '@/pages/resource/list/index.store'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    global,
    console,
    home,
    resourceList
  }
})
