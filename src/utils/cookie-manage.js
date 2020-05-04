const prefix = 'cmdb_'
class CookieManage {
  /**
   * 获取
   * @param {string} name cookie名
   */
  get (name) {
    name = prefix + name
    if (document.cookie.length > 0) {
      let cStart = document.cookie.indexOf(name + '=')
      if (cStart !== -1) {
        cStart = cStart + name.length + 1
        let cEnd = document.cookie.indexOf(';', cStart)
        if (cEnd === -1) {
          cEnd = document.cookie.length
        }
        return unescape(document.cookie.substring(cStart, cEnd))
      }
    }
    return ''
  }

  /**
   *
   * @param {string} name cookie名
   * @param {string} value cookie值
   * @param {number} expires 过期时间  毫秒
   */
  set (name, value, expires = null) {
    name = prefix + name
    const expireDate = new Date()
    expireDate.setTime(expireDate.getTime() + expires)
    document.cookie = name + '=' + escape(value) + ((expires === null) ? '' : ';expires=' + expireDate.toGMTString())
  }

  /**
   * 移除cookie
   * @param {string} name cookie名
   */
  remove (name) {
    name = prefix + name
    const exp = new Date()
    exp.setTime(exp.getTime() - 1)
    const val = this.get(name)
    if (val !== null) { document.cookie = name + '=' + val + ';expires=' + exp.toGMTString() }
  }

  clear () {
    const keys = document.cookie.match(/[^ =;]+(?==)/g)
    if (keys) {
      for (let i = keys.length; i--;) {
        document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString() // 清除当前域名下的,例如：m.ratingdog.cn
        document.cookie = keys[i] + '=0;path=/;domain=' + document.domain + ';expires=' + new Date(0).toUTCString() // 清除当前域名下的，例如 .m.ratingdog.cn
        document.cookie = keys[i] + '=0;path=/;domain=ratingdog.cn;expires=' + new Date(0).toUTCString() // 清除一级域名下的或指定的，例如 .ratingdog.cn
      }
    }
  }
}
export default new CookieManage()
