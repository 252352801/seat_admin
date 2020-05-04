import { isObj } from '@/utils'
export class PageTag {
  limit = 20
  items = []
  beforeLeaveHandlerMap = {}
  beforeActiveHandlerMap = {}
  afterActiveHandlerMap = {}
  router
  init (router) {
    this.router = router

    const items = []// this.getCacheData() || []
    // this.setCache()
    if (!items.length) {
      this.addItem(router.history.current)
    }
    if (router && typeof router === 'object') {
      if (typeof router.beforeEach === 'function') {
        router.beforeEach((to, from, next) => {
          const blHandler = this.beforeLeaveHandlerMap[from.fullPath]
          if (typeof blHandler === 'function') {
            blHandler(to, from)
          }
          const baHandler = this.beforeActiveHandlerMap[to.fullPath]
          if (typeof baHandler === 'function') {
            baHandler(to, from)
          }
          next()
        })
      }
      if (typeof router.afterEach === 'function') {
        router.afterEach((to, from) => {
          this.handleRouteChange(to, from)
          const handler = this.afterActiveHandlerMap[to.fullPath]
          if (typeof handler === 'function') {
            handler(to, from)
          }
        })
      }
    }
  }

  /**
   * 获取缓存数据
   * @returns {array}
   */
  getCacheData () {
    let items = []
    // 缓存
    const storeData = sessionStorage.getItem('pageTag')
    if (storeData) {
      try {
        const parseData = JSON.parse(storeData)
        if (parseData instanceof Array) {
          items = parseData.map(ele => {
            if (ele && typeof ele === 'object') {
              const routeConf = this.matchRouteConf(ele.path, this.router)
              ele.component = routeConf ? routeConf.component : {}
            }
            return ele
          })
          this.items = items
        }
      } catch (err) {}
    }
    return items
  }

  /**
   * 缓存处理
   */
  setCache () {
    if (
      window &&
      typeof window === 'object' &&
      typeof window.addEventListener === 'function'
    ) {
      window.addEventListener('beforeunload', () => {
        sessionStorage.setItem('pageTag', JSON.stringify(this.items))
      })
    }
  }

  handleRouteChange (to, from) {
    // 路由变更后处理
    let activeItem
    let wouldAdd = false
    const activedPage = this.matchActivedPage(to.fullPath)
    if (!activedPage) {
      wouldAdd = true
    } else {
      activeItem = activedPage
    }
    if (wouldAdd) {
      // 新增
      this.addItem(to)
      activeItem = this.items[this.items.length - 1]
    }
    this.activate(activeItem)
  }

  beforeLeave (path, handler) {
    this.beforeLeaveHandlerMap[path] = handler
  }

  beforeActive (path, handler) {
    this.beforeActiveHandlerMap[path] = handler
  }

  afterActive (path, handler) {
    this.afterActiveHandlerMap[path] = handler
  }

  matchActivedPage (fullPath) {
    return this.items.find(ele => ele.fullPath === fullPath)
  }

  matchRouteParentPath (route, path) {
    if (isObj(route) && isObj(route.parent)) {
      if (path.replace(/\/$/, '') === route.parent.path) {
        return this.matchRouteParentPath(route.parent, path)
      }
      return route.parent.path
    }
    return ''
  }

  addItem (route) {
    if (this.items.filter(ele => ele.tagable).length >= this.limit) {
      this.items.shift()
    }
    const { name, query, params } = route
    const label = route.meta.location
    const matchedRoute = route.matched[route.matched.length - 1]
    if (!matchedRoute) {
      return
    }
    const routeConf = this.matchRouteConf(matchedRoute.path, this.router)
    if (!routeConf) {
      return
    }
    const component = routeConf.component
    let parentPath = ''
    if (isObj(matchedRoute) && isObj(matchedRoute.parent)) {
      parentPath = matchedRoute.parent.path
    }
    // 检测是否有父级
    // 若无父级，先新增父级，此时父级不在tag中显示
    const lostParents = this.getLostParents(route.matched)
    const oldItems = [...this.items]
    this.items = []
    this.items = oldItems.concat([
      ...lostParents,
      {
        name,
        tagable:
          routeConf.meta.tagable !== undefined
            ? !!routeConf.meta.tagable
            : true,
        label,
        query,
        params,
        path: matchedRoute.path || '/',
        fullPath: route.fullPath,
        active: true,
        component,
        parentPath: parentPath || '/'
      }
    ])
  }

  getLostParents (matched) {
    const items = []
    if (matched instanceof Array) {
      for (let i = 0, len = matched.length - 1; i < len; i++) {
        const ele = matched[i]
        if (!this.testIsParent(ele.path)) {
          const routeConf = this.matchRouteConf(ele.path, this.router)
          const component = routeConf ? routeConf.component : {}
          items.push({
            name: ele.name,
            label: ele.meta.location,
            path: ele.path || '/',
            fullPath: ele.fullPath,
            parentPath: ele.parent ? ele.parent.path : '/',
            component: component,
            active: false,
            tagable: false // 是否可打标签
          })
        }
      }
    }
    return items
  }

  testIsParent (path) {
    return this.items.some(ele => ele.path === path)
  }

  removeItem (item) {
    this.items = this.items.filter(ele => ele.fullPath !== item.fullPath)
  }

  activate (item) {
    this.clearActive()
    if (isObj(item)) {
      item.active = true
    }
  }

  clearActive () {
    this.items.forEach(ele => {
      ele.active = false
    })
  }

  go (item) {
    this.routingItem = item
    const route = { path: item.fullPath }
    this.router.push(route)
  }

  replace (item) {
    if (item) {
      this.routingItem = item
      const route = { path: item.fullPath }
      this.router.replace(route)
    } else {
      this.router.replace({ name: 'home' })
    }
  }

  back (fromPath, toPath) {
    const index = this.items.findIndex(ele => ele.fullPath === fromPath)
    if (index >= 0) {
      const parentPath = this.items[index].parentPath
      this.items.splice(index, 1)
      const targetPath = toPath || parentPath
      if (targetPath) {
        this.router.replace({ path: targetPath })
      } else {
        this.router.go(-1)
      }
    }
  }

  refresh (tag) {
    const item = tag
    const component = item.component
    item.component = {
      data: function () {
        return {}
      },
      template: '<div></div>'
    }
    setTimeout(() => {
      item.component = component
    })
  }

  matchRoute (path, routes, parentPath) {
    path = path || '/'
    // 缓存
    // ...
    for (const route of routes) {
      const routePath =
        (parentPath ? parentPath + '/' + route.path : route.path) || '/'
      if (routePath === path) {
        return route
      } else if (route.children instanceof Array && route.children.length) {
        const match = this.matchRoute(path, route.children, routePath)
        if (match) {
          return match
        }
      }
    }
  }

  matchRouteConf (path, router) {
    if (router && typeof router === 'object' && typeof path === 'string') {
      const routes = router.options.routes
      const conf = this.matchRoute(path, routes, '')
      return conf
    }
  }

  getItemsByParentPath (pPath) {
    return this.items.filter(ele => ele.parentPath === pPath)
  }

  getItemsByPath (path) {
    return this.items.filter(ele => ele.path === path)
  }

  getItemsByName (name) {
    return this.items.filter(ele => ele.name === name)
  }
}
