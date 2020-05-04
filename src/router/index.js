import Vue from 'vue'
import Router from 'vue-router'
import Init from '@/pages/init/init'
import store from '@/store'
import { Message } from 'element-ui'
// import Wrapper from '@/components/wrapper'
import permitCtrl from '@/utils/permitctrl'
import { leaveConfirm } from './leave-interceptor'
import api from '@/api'
import { IS_PERMIT_CTRL, IS_REQUIRED_LOGIN } from '../config'
Vue.use(Router)
/**
 * 设置meta.location 的值用以标示当前路由标题（loaction组件会用到）
 */
const routerConf = {
  routes: [
    {
      path: '/',
      name: 'init',
      meta: { location: '初始化' },
      component: Init
    },
    {
      path: '/console',
      name: 'console',
      meta: {},
      component: resolve => require(['@/pages/console/console'], resolve),
      children: [
        {
          path: 'home',
          name: 'home',
          meta: { location: '首页' },
          component: resolve => require(['@/pages/home/home'], resolve)
        },
        {
          path: 'user',
          name: 'user',
          meta: { location: '登录用户信息' },
          component: resolve => require(['@/pages/user'], resolve)
        },
        {
          path: 'resource',
          meta: { location: '资源管理' },
          component: resolve => require(['@/pages/resource'], resolve),
          children: [
            {
              path: '',
              name: 'resource',
              meta: { location: '资源管理' },
              component: resolve =>
                require(['@/pages/resource/list'], resolve)
            },
            {
              path: 'create',
              name: 'resource-create',
              meta: { location: '新增资源' },
              component: resolve =>
                require([
                  '@/pages/resource/create'
                ], resolve)
            },
            {
              path: 'modify/:id',
              name: 'resource-modify',
              meta: { location: '资源修改' },
              component: resolve =>
                require(['@/pages/resource/modify'], resolve)
            },
            {
              path: 'bind/:id',
              name: 'resource-bind',
              meta: { location: '编辑座位' },
              component: resolve =>
                require(['@/pages/resource/bind'], resolve)
            },
            {
              path: ':id',
              name: 'resource-detail',
              meta: { location: '资源详情' },
              component: resolve =>
                require([
                  '@/pages/resource/detail'
                ], resolve)
            }
          ]
        }
      ]
    }
  ]
}

const intercept = true
const testPermit = IS_PERMIT_CTRL
/**
 * 设置页签tab配置
 * @param {*} routes
 */
function setTabConf (routes) {
  routes.forEach(route => {
    if (!route.meta) {
      route.meta = {}
    }
    route.meta.tabConfig = {
      tabName (to, from) {
        return to.meta.location || '页签'
      },
      alwaysNewTab: false// route.name !== 'home'
    }
    if (route.children instanceof Array && route.children.length) {
      setTabConf(route.children)
    }
  })
}
setTabConf(routerConf.routes)
const router = new Router(routerConf)
const canActive = (to, from, next) => {
  if (permitCtrl.matchPage(to.name)) {
    next()
  } else {
    next()
    const pageName = to.meta.location || to.fullPath
    // 无权限进入页面的处理
    Message.warning(`您无权限进入页面：${pageName}`)
    router.replace({ name: 'home' })
  }
}
router.beforeEach((to, from, next) => {
  if (!intercept) {
    next()
  } else if (to.matched.some(route => route.name === 'console')) {
    if (store.getters.isLogin || !IS_REQUIRED_LOGIN) {
      next()
    } else {
      api.user.login()
    }
  } else {
    next()
  }
})
router.beforeEach((to, from, next) => {
  if (!intercept) {
    next()
    return
  }
  const ignores = ['home', 'init'] // 忽略列表 根据路由配置情况,将不需要拦截的路由名称（name的值）列出
  const ignore = !to.name || ignores.indexOf(to.name) >= 0 // 是否忽略  路由无name属性或者在忽略列表中时，直接跳过
  if (ignore || !testPermit) {
    next()
  } else {
    if (permitCtrl.isEmpty()) {
      // 监听权限数据更新
      permitCtrl.onUpdate(() => {
        canActive(to, from, next)
      }, true) // 第二个参数true 只监听一次
    } else {
      canActive(to, from, next)
    }
  }
})
// 页面离开确认
router.beforeEach((to, from, next) => {
  leaveConfirm(to, from, next)
})
export default router
