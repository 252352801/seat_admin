const confirmMap = {}
export function leaveConfirm (to, from, next) {
  const confirmed = confirmMap[from.fullPath]
  if (confirmed !== undefined) {
    // 如果不是第一次验证
    if (confirmed) {
      // 曾经验证通过 --通过
      next()
    }
    delete confirmMap[from.fullPath]
  } else {
    const _next = () => {
      confirmMap[from.fullPath] = true
      next()
    }
    if (to.fullPath === from.fullPath) {
      _next(true)
      return
    }
    let confirm
    const matchRoute = from.matched[from.matched.length - 1]
    let vm
    let comConf
    if (matchRoute) {
      comConf = matchRoute.components.default // 组件配置
      vm = matchRoute.instances.default // 组件上下文
      confirm = comConf.leaveConfirm
    }
    if (vm && typeof confirm === 'function') {
      const res = confirm.apply(vm)
      if (res) {
        if (typeof res === 'object' && typeof res.then === 'function') {
          res
            .then(() => {
              _next()
            })
            .catch(() => {
            })
        } else {
          _next()
        }
      }
    } else {
      _next(true)
    }
  }
}
// 中间校验
// 保存中间状态

// 最终校验
// 去掉中间状态
