const handlers = {
  //   'fetch': {
  //     'appList': [{
  //       once: false,
  //       fn: () => {}
  //     }]
  //   }
}
/**
 * 一个简单的事件监听器
 */
export class AppEvent {
  handlers = handlers
  /**
   * 监听
   * @param {*} ev 事件名 多个事件用逗号,连接或数组表示
   * @param {*} fn 处理函数
   * @param {*} isOnce 是否fn只执行一次
   */
  on (ev, fn, isOnce) {
    let evs = []
    if (typeof ev === 'string') {
      evs = ev.split(',')
    } else if (ev instanceof Array) {
      evs = ev
    }
    evs.forEach(evName => {
      if (!this.handlers[evName]) {
        this.handlers[evName] = []
      }
      this.handlers[evName].push({
        once: !!isOnce,
        fn: fn
      })
    })
  }

  /**
   * 移除事件
   * @param {*} ev 事件名
   * @param {*} fn 函数
   */
  remove (ev, fn) {
    const handler = handlers[ev]
    if (handler instanceof Array) {
      for (let i = 0, len = handler.length; i < len; i++) {
        if (handler[i].fn === fn) {
          handler.splice(i, 1)
          break
        }
      }
    }
  }

  /**
   * 触发
   * @param {*} ev 事件名
   * @param  {...any} args 处理函数传入参数
   */
  trigger (ev, ...args) {
    let handlersMap = this.handlers[ev]
    if (handlersMap) {
      const handlers = handlersMap
      if (handlers) {
        const newHandlers = []
        handlers.forEach(hd => {
          if (typeof hd.fn === 'function') {
            hd.fn(...args)
          }
          if (!hd.once) {
            newHandlers.push(hd)
          }
        })
        handlersMap = newHandlers
      }
    }
  }
}

// const eventConfig = {
//   roleCreate: 'roleCreate', // 角色新增
//   roleUpdate: 'roleUpdate', // 角色更新
//   roleAssignChange: 'roleAssignChange', // 角色分配变更
//   resourceGroupCreate: 'resourceGroupCreate', // 资源角色新增
//   resourceGroupUpdate: 'resourceGroupUpdate', // 资源角色修改(名称、标签修改)
//   resourceGroupAssignChange: 'resourceGroupAssignChange', // 资源角色分配修改
//   resourceConfigGroupChange: 'resourceConfigGroupChange', // 资源角色分组修改
//   resourceGroupBindDataChange: 'resourceGroupBindDataChange', // 资源角色绑定数据修改
//   appCreate: 'appCreate', // 应用新增
//   appUpdate: 'appUpdate', // 应用更新
//   moduleConfigChange: 'moduleConfigChange', // 页面配置修改
//   resourceCreate: 'resourceCreate', // 资源维度新增
//   resourceUpdate: 'resourceUpdate', // 资源维度更新
//   resourceTagCreate: 'resourceTagCreate', // 资源维度新增
//   resourceTagUpdate: 'resourceUpdate', // 资源维度更新
//   adminCreate: 'adminCreate', // 超管新增
//   adminDelete: 'adminDelete', // 超管删除
//   userRolesChange: 'userRolesChange', // 用户角色绑定变化
//   userResourceGroupChange: 'userResourceGroupChange', // 用户资源角色绑定变化
//   userResourceDataChange: 'userResourceDataChange' // 用户绑定资源变化
// }
// export default eventConfig
