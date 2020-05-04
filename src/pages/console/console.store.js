import router from '@/router'
import http from '@/http'
import api from '@/api'
/**
 * 根据菜单属性
 * @param {*} routeName
 */
function menuProps (routeName) {
  const path = getRoutePathByName(routeName)
  const props = {
    routeName: routeName,
    path,
    pathMatchFull: true
  }
  return props
}
/**
 * 通过name获取路由path
 * @param name <string> 路由的name属性
 * @param path <string> 前置路径
 * @param routes <Array[object]> 路由列表
 */
function getRoutePathByName (name, path = '', routes = router.options.routes) {
  let result = ''
  if (name && routes instanceof Array) {
    for (const route of routes) {
      const prePath =
        /.*\/$/.test(path) || /^\/.*/.test(route.path) ? path : path + '/'
      const curPath = (prePath + route.path).replace(/\/$/, '')
      if (route.name === name) {
        result = curPath
        break
      } else if (route.children instanceof Array) {
        result = getRoutePathByName(name, curPath, route.children)
        if (result) {
          break
        }
      }
    }
  }
  return result
}
/* ========================================================================== */
const state = {
  /** 是否折叠 */
  collapse: false
}
const getters = {
  menuData (state) {
    const menu = [
      // {
      //   icon: 'iconfont icon-baobiao-selected',
      //   label: '仪表盘',
      //   ...menuProps('dashboard'),
      //   subMenu: []
      // },
      {
        icon: 'iconfont icon-resource',
        label: '资源管理',
        ...menuProps('resource'),
        isLeaf: true
      }
    ]
    return menu
  },
  collapse (state) {
    return state.collapse
  }
}
const mutations = {
  setCollapse (state, payload) {
    state.collapse = payload
  }
}
const actions = {
  toggleCollapse (context, parameter) {
    context.commit('setCollapse', !context.state.collapse)
  },
  handleOpen (context, parameter) { },
  handleClose (context, parameter) { },
  logout (context, parameter) {
    api.user.logout()
  },
  login () {
    api.user.login()
  },
  resetListPageParams (context, parameter) {
    const states = this.state
    const listStores = []
    for (const k in states) {
      // 项目中列表页的store名称有List标识
      if (k.toLowerCase().indexOf('list') >= 0) {
        if (states[k].params) {
          listStores.push(k)
        }
      }
    }
    listStores.forEach(ele => {
      this.dispatch(ele + '/resetParams') // 列表页重置参数的方法为resetParams
    })
  },
  refresh (context, parameter) {
    return http.get('/plat/UserService/refresh')
  },
  refreshResource (context, parameter) {
    return http.get('/plat/ResourceSceneService/refresh/resource')
  },
  /**
   * 获取登录用户的功能权限
   * @returns * 权限数据
   */
  async getLoginUserOperations () {
    const data = await api.user.getFunctions()
    return data
  }
}
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
