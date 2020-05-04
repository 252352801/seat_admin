/* 全线数据更新后的处理函数 */
let updateHandlers = [
  /* {
      isOnce: false, // 是否只监听一次
      action: () => {} // 处理函数
    } */
]
/**
 * 权限控制
 * 登录后获取登录用户权限信息
 * 将权限信息格式化成json/map结构数据
 * 通过页面唯一标识和操作的唯一标识匹配是否有某个页面里的某个操作的权限
 */
class PermitCtrl {
  permission = {
    /*  '路由/页面code': {
          '权限/操作code': {
              //具体的权限信息
          }
      } */
  }

  /**
   * 获取权限数据
   * @returns {*}
   */
  get () {
    return this.permission
  }

  /**
   * 设置权限数据
   * @param {*} val 要设置的数据
   * @param {boolean} isFormat 是否格式化
   */
  set (val, isFormat = false) {
    this.permission = isFormat ? this.format(val) : val
    this.triggerUpdate()
  }

  /**
   * 是否权限数据为空
   */
  isEmpty () {
    for (const k in this.permission) {
      return false
    }
    return true
  }

  /**
   * 格式化(接口返回的)权限数据
   * @param {*} data
   * @returns {*}
   */
  format (data) {
    const formattedData = {}
    // 格式化并存储权限数据
    if (data instanceof Array) {
      // 2.0+接口返回数据
      data.forEach(ele => {
        if (ele && typeof ele === 'object') {
          formattedData[ele.code] = {}
          if (ele.operates instanceof Array) {
            ele.operates.forEach(oprt => {
              if (oprt && typeof oprt === 'object') {
                formattedData[ele.code][oprt.code] = oprt
              }
            })
          }
        }
      })
    } else if (data && typeof data === 'object') {
      // 3.0+接口返回数据
      for (const field in data) {
        formattedData[field] = {}
        if (data[field] instanceof Array) {
          data[field].forEach(operationCode => {
            if (typeof operationCode === 'string') {
              formattedData[field][operationCode] = {}
            }
          })
        }
      }
    }
    return formattedData
  }

  /**
   * 匹配操作权限
   * @param {string} operationCode
   * @param {string} pageCode
   * @returns {*}
   */
  matchOperation (operationCode, pageCode) {
    const pagePermission = this.matchPage(pageCode)
    if (pagePermission && typeof pagePermission === 'object') {
      return pagePermission[operationCode]
    }
  }

  /**
   * 是否包含其中任意操作权限
   * @param  {...any} args 操作code
   */
  isAnyOperation (pageCode, ...args) {
    const codes = [...new Set(args)]
    return codes.some(code => this.matchOperation(code, pageCode))
  }

  /**
   * 匹配页面
   * @param {string} pageCode
   * @returns {*}
   */
  matchPage (pageCode) {
    if (this.permission && typeof this.permission === 'object') {
      return this.permission[pageCode]
    }
  }

  /**
   * 触发更新
   */
  triggerUpdate () {
    updateHandlers = updateHandlers.map(uh => {
      if (typeof uh.action === 'function') {
        uh.action(this.permission)
      }
      if (!uh.isOnce) {
        return uh
      }
    }).filter(uh => uh !== undefined)
  }

  /**
   * 监听更新
   * @param {*} handler 处理函数
   * @param {*} isOnce 是否只监听一次
   */
  onUpdate (handler, isOnce = false) {
    updateHandlers.push({
      isOnce: isOnce,
      action: handler
    })
  }
}
export default new PermitCtrl()
