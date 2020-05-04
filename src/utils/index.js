/**
 * 将数据序列化成url参数
 * 转为键值对数据(中括号和点符号组合):a=1&b[0]=1&b[1]=2&b[2].bb=3
 * @param obj
 * @param filter 过滤的值
 * @returns {string}
 */
export const serializeURLParams = (obj, filter) => {
  const serialize = (obj, collector, prevKey = '') => {
    if (obj === null || obj === undefined) {
      return
    }
    if (typeof obj === 'object') {
      for (const o in obj) {
        const newObj = obj[o + '']
        const curKey = obj instanceof Array ? '[' + o + ']' : (prevKey ? '.' : '') + o
        const newKey = prevKey ? prevKey + curKey : curKey
        serialize(newObj, collector, newKey)
      }
    } else {
      const val = encodeURIComponent(obj)
      let valid = true
      if (filter !== undefined) {
        valid =
          filter instanceof Array
            ? !filter.some(ele => ele === val)
            : filter !== val
      }
      if (valid) {
        collector.push(prevKey ? prevKey + '=' + val : val)
      }
    }
  }
  const params = []
  serialize(obj, params)
  return params.length > 0 ? params.join('&') : ''
}

/**
 * 深拷贝
 * @param {*} obj
 */
export const clone = (obj) => {
  let newObj
  if (obj instanceof Array) {
    newObj = []
    obj.forEach(ele => {
      newObj.push(clone(ele))
    })
  } else if (obj && typeof obj === 'object') {
    newObj = {}
    for (const o in obj) {
      newObj[o] = clone(obj[o])
    }
  } else {
    newObj = obj
  }
  return newObj
}

/**
 * 删除对象相应值的字段
 * @param {*} data 要删除的数据对象
 * @param {*} value 字段值为value时删除
 */
export function deleteObjField (data, value) {
  const deleteFn = (data, value, obj, field) => {
    if (data instanceof Array) {
      for (const item of data) {
        deleteFn(item, value)
      }
    } else if (isObj(data)) {
      for (const field in data) {
        deleteFn(data[field], value, data, field)
      }
    } else {
      if (value instanceof Array) {
        if (value.some(ele => ele === data)) {
          delete obj[field]
        }
      } else if (isObj(obj) && value === data) {
        delete obj[field]
      }
    }
  }
  deleteFn(data, value)
  return data
}

export function createDate (data, zone) {
  if (!data) {
    return data
  }
  let nowDate
  if (data instanceof Date) {
    nowDate = data
  } else if (typeof data === 'string') {
    nowDate = (dateStr => {
      let date = new Date(dateStr)
      if (date + '' === 'Invalid Date') {
        date = new Date(dateStr + ''.replace(/-/g, '/').replace(/\.\d+$/, ''))
        if (date + '' === 'Invalid Date') {
          return null
        }
      }
      return date
    })(data)
  } else if (typeof value === 'number') {
    nowDate = new Date(data)
  }
  if (nowDate && zone) {
    if (!(/^[+-]?\d+$/.test(zone + '')) && zone >= -12 && zone <= 12) {
      throw new Error(`错误的时区：${zone} 请指定正确的时区，东区为正数，西区为负数`)
    }
    // 时区转换
    const timezone = zone // 目标时区
    const offsetGMT = new Date().getTimezoneOffset() // 本地时间和格林威治的时间差，单位为分钟
    const nowDateTime = new Date().getTime() // 本地时间距 1970 年 1 月 1 日午夜（GMT 时间）之间的毫秒数
    const targetDate = new Date(nowDateTime + offsetGMT * 60 * 1000 + timezone * 60 * 60 * 1000)
    nowDate = targetDate
  }
  return nowDate
}
/**
 * 日期时间格式化
 * @param {*} datetime
 * @param {*} format
 * @param {*} targetTimeZone 需要转换的时区   东时区为正数；西时区为负数
 * @returns {string}
 */
export const datetimeFormat = (datetime, format = 'yyyy-MM-dd hh:mm:ss', targetTimeZone = 8) => {
  const value = datetime
  let fmt = format
  if (value) {
    let date = createDate(value, targetTimeZone)
    if (value instanceof Date) {
      date = value
    } else if (typeof value === 'string') {
      date = (dateStr => {
        let date = new Date(dateStr)
        if (date + '' === 'Invalid Date') {
          date = new Date(dateStr + ''.replace(/-/g, '/').replace(/\.\d+$/, ''))
          if (date + '' === 'Invalid Date') {
            return null
          }
        }
        return date
      })(value)
    } else if (typeof value === 'number') {
      date = new Date(value)
    }
    if (!date) {
      return value
    }
    const o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'h+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      S: date.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        (date.getFullYear() + '').substr(4 - RegExp.$1.length)
      )
    }
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1
            ? o[k]
            : ('00' + o[k]).substr(('' + o[k]).length)
        )
      }
    }
    return fmt
  } else {
    return value
  }
}
/**
 * 下载文件
 * @param {string} url 文件地址
 */
export const download = (url, filename = 'download') => {
  if (document) {
    const aElem = document.createElement('A')
    aElem.setAttribute('download', filename)
    aElem.setAttribute('href', url)
    aElem.setAttribute('target', '_self')
    aElem.style.display = 'none'
    document.body.appendChild(aElem)
    aElem.click()
    setTimeout(() => {
      document.body.removeChild(aElem)
    })
  }
}

/**
 * 判断是否是非空对象
 * @param {*} val
 * @param {string} fields
 */
export function isObj (val, fields) {
  const valid = val && typeof val === 'object'
  if (!fields) {
    return valid
  } else if (valid && typeof fields === 'string') {
    const splitArr = fields.split('.')
    const curField = splitArr.shift()
    return isObj(val[curField], splitArr.join('.'))
  }
}

/**
 * 根据传入的key读取对象的属性值
 * @param {*} obj
 * @param {string} key 行如 a.b.c
 */
export const readObj = (obj, key) => {
  if (obj && typeof obj === 'object') {
    const keys = key.split('.')
    const curKey = keys.shift()
    const curObj = obj[curKey]
    if (keys.length) {
      return readObj(curObj, keys.join('.'))
    } else {
      return curObj
    }
  } else {
    return obj
  }
}
/**
 * 根据传入的key读取对象的属性值
 * @param {*} obj
 * @param {string} key 行如 a.b.c
 */
export const get = (obj, key) => {
  return readObj(obj, key)
}
/**
 * 是否是浮点数
 * @param {*} val
 */
export const isFloat = val => {
  const regExp = /^[+-]?\d+(\.\d+)?$/
  return regExp.test(val + '')
}

/**
 * 组合成url
 * @param {*} host
 * @param {*} path
 */
export const combineUrl = (host, path) => {
  if (typeof host === 'string' && typeof path === 'string') {
    if (/^(http[s]?:)?[/]{2}/.test(path)) {
      return path
    } else {
      return host.replace(/\/$/, '') + '/' + path.replace(/^\//, '')
    }
  } else {
    return ''
  }
}

/**
 * 根据文件名判断是否是excel文件
 * @param {*} filename
 */
export const isExcel = filename => {
  if (typeof filename === 'string') {
    return /.*((\.xls)|(\.xlsx)|(\.csv))$/.test(filename)
  }
  return false
}

/**
 * 获取文件后缀名
 * @param {*} filename
 */
export function getfilenameExtension (filename) {
  if (typeof filename === 'string') {
    const splits = filename.split('.')
    const splitLen = splits.length
    if (splitLen > 1 && splits[splitLen - 1]) {
      return '.' + splits[splitLen - 1]
    }
  }
  return ''
}

/**
 * 防抖动函数
 * @param fn 函数
 * @param delay 延迟
 * @returns {Function}
 */
export function debounce (fn, delay = 300) {
  let timeout = null
  return function () {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn.apply(this, arguments)
    }, delay)
  }
}

/**
 * 函数节流
 * @param  {Function} fn       函数
 * @param  {Number}   delay 延迟
 * @return {[type]}
 */
export function throttle (fn, delay = 300) {
  let canRun = true
  return function () {
    if (!canRun) return
    canRun = false
    setTimeout(() => {
      fn.apply(this, arguments)
      canRun = true
    }, delay)
  }
}

/**
 * 获取数据的深度
 * @param {*} data
 * @param {string} childrenField 子集字段
 * returns Number 深度
 */
export function getDataDeep (data, childrenField) {
  const deepArr = []
  const fn = (iData, deep) => {
    if (iData instanceof Array) {
      if (iData.length === 0) {
        deepArr.push(deep)
      }
      iData.forEach(ele => {
        if (ele[childrenField] instanceof Array || isObj(ele[childrenField])) {
          fn(ele[childrenField], deep + 1)
        } else {
          deepArr.push(deep)
        }
      })
    } else if (isObj(iData)) {
      if (iData[childrenField] instanceof Array || isObj(iData[childrenField])) {
        fn(iData[childrenField], deep + 1)
      } else {
        deepArr.push(deep)
      }
    }
  }
  fn(data, 1)
  return Math.max(...deepArr)
}

/**
 * 通过key（和key值）获取对象/数组中某个元素
 * @param {*} data
 * @param {string} key key字段名
 * @param {*} keyValue key的值
 * @param {string} childrenField 子对象/数组字段
 * @returns 匹配值
 */
export const getItemByKey = (() => {
  // let getItem, run
  function getItem (obj, key, keyValue, childrenField) {
    if (obj[key] === keyValue) {
      return obj
    } else if (childrenField && obj[childrenField]) {
      const res = run(obj[childrenField], key, keyValue, childrenField)
      if (res) {
        return res
      }
    }
  }
  function run (data, key, keyValue, childrenField) {
    if (data instanceof Array) {
      for (const item of data) {
        if (item && typeof item === 'object') {
          const res = getItem(item, key, keyValue, childrenField)
          if (res !== undefined) return res
        }
      }
    } else if (data && typeof data === 'object') {
      return getItem(data, key, keyValue, childrenField)
    }
  }
  return run
})()
/**
 * 创建一棵树
 * @description 通过父级索引字段建立树形数据
 * @param {Array} objList 对象列表
 * @param {string} key 唯一索引
 * @param {string} parentField 父级索引字段
 * @param {string} childrenField 子集存储字段
 */
export function createTree (objList, key, parentField, childrenField) {
  const tree = []
  const tempTree = clone(objList)
  tempTree.forEach((item, index) => {
    if (item) {
      const parentKeyValue = item[parentField]
      const isParent = parentKeyValue || parentKeyValue === 0
      let parent
      if (isParent) {
        parent = getItemByKey(tempTree, key, parentKeyValue, childrenField)
      }
      if (parent) {
        if (!(parent[childrenField] instanceof Array)) {
          parent[childrenField] = []
        }
        parent[childrenField].push(item)
        tempTree[index] = null
      }
    }
  })
  tempTree.forEach(ele => {
    if (ele !== null) {
      tree.push(ele)
    }
  })
  return tree
}
/**
 * 生产饿了么UI的表单验证器
 * label:字段文字，
 * rule:单个校验规则配置 如{validate:(val)=>{}, regExp:xxx,desc:'xxx'}
 * 其中validate为校验函数（传入参数为当前值），regExp为正则表达式，desc为规则描述，优先使用validate校验
 * rules:多个校验规则配置
 * trigger:触发事件
 * uniqueValite：唯一性校验Promise，入参为当前值
 * fetchSuggestion：唯一检验不通过时获取推荐
 * @param {*} param
 */
export const generateElementUIValidator = ({ label = '', rule, rules, trigger = 'blur', uniqueValite, fetchSuggestion }) => {
  const _validate = (_rule, _value) => {
    if (_value === '' || _value === null || _value === undefined) {
      return true
    }
    if (typeof _rule.validate === 'function') {
      return !!_rule.validate(_value)
    }
    const regExp = _rule.regExp
    const valid = regExp.test(_value)
    return valid
  }
  const _createRulesErrMsg = desc => {
    return `${label}应符合：${desc}`
  }
  return {
    validator: async (elemRule, value, callback) => {
      let allValid = true
      if (rules instanceof Array) {
        for (let i = 0; i < rules.length; i++) {
          const valid = _validate(rules[i], value)
          if (!valid) {
            callback(new Error(_createRulesErrMsg(rules[i].desc)))
            allValid = false
            break
          }
        }
      } else {
        const singleValid = rule ? _validate(rule, value) : true
        if (!singleValid) {
          callback(new Error(_createRulesErrMsg(rule.desc)))
        }
        allValid = singleValid
      }
      let uniqueErr = false
      if (allValid) {
        if (typeof uniqueValite === 'function') {
          let remoteErr = false
          const res = await uniqueValite(value).catch(() => {
            remoteErr = true
            callback(new Error(`${label}远程校验失败，请稍后重试`))
          })
          if (remoteErr) return
          uniqueErr = !res // 约定返回boolean
          if (uniqueErr) {
            console.log(fetchSuggestion)
            if (typeof fetchSuggestion === 'function') {
              const msg = await fetchSuggestion(value).catch(() => null)
              if (msg) {
                callback(new Error(msg))
                return
              }
            }
            callback(new Error(`${label}"${value}"已存在`))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
    },
    trigger
  }
}
/**
 * 生成elemet-ui组合唯一校验器
 * keys:组合唯一的字段列表
 * labels:组合唯一的字段名列表
 * fieldName:子元素所在字段的字段名
 * getItemsFn:获取子元素（子组件）的方法
 * getFormData:获取子元素表单数据的方法 如参为getItemsFn返回的单个子元素
 * @param {*} param
 * @return {Object} {validator:(...)=>{...},trgger:'change'}
 */
export function genElementUICombineUniqueValidtor ({ keys, labels, fieldName, getItemsFn, getFormData }) {
  return {
    // 组合唯一校验
    validator: (rules, value, callback) => {
      const itemComponents = getItemsFn.call(this)
      const uniqueCombineMap = {
        // [label1.label2]:[index1,index2]
      }
      itemComponents.forEach((comp, index) => {
        const fd = getFormData(comp)
        const isNoNullValue = keys.every(key => (!!fd[key]) || fd[key] === 0)
        if (isNoNullValue) {
          const key = keys.map(key => fd[key]).join('_')
          if (!(uniqueCombineMap[key] instanceof Array)) {
            uniqueCombineMap[key] = []
            uniqueCombineMap[key].push(index)
          } else if (uniqueCombineMap[key].indexOf(index) === -1) {
            uniqueCombineMap[key].push(index)
          }
        }
      })
      console.log(uniqueCombineMap)
      const indexValues = Object.values(uniqueCombineMap)
      let valid = true
      const errMsgArr = []
      indexValues.forEach(indexes => {
        if (indexes.length > 1) {
          valid = false
          errMsgArr.push(
            `${fieldName}${indexes.map(i => i + 1).join(',')}`
          )
        }
      })
      if (valid) {
        callback()
      } else {
        const combindText = labels.join('&')
        callback(
          new Error(
            `“${errMsgArr.join(
              ','
            )}”选择了重复的“${combindText}”组合，应符合“${combindText}”组合唯一`
          )
        )
      }
    },
    trigger: 'change'
  }
}

export function isPromise (obj) {
  return obj && typeof obj === 'object' && typeof obj.then === 'function'
}
export function isAxiosRequestTimeout (err) {
  return get(err, 'code') === 'ECONNABORTED'
}
export function testIsDuplicate ({ list, keyField, valueField, selfKey, testValue }) {
  const items = list
  if (!selfKey) {
    return Array.isArray(items) && items.filter(ele => ele[valueField] === testValue).length > 0
  } else {
    return Array.isArray(items) && items.some(ele => ele[valueField] === testValue && ele[keyField] !== selfKey)
  }
}
export function hasChinese (str) {
  const hasChinesRegExp = /[\u4e00-\u9fa5]+/
  return hasChinesRegExp.test(str)
}
/**
* 获取鼠标位置
* @param {MouseEvent} e
* @returns <{left: number; top: number}>
*/
export function getMousePosition (e) {
  var mx =
    e.pageX ||
    e.clientX +
    (document.documentElement.scrollLeft || document.body.scrollLeft)
  var my =
    e.pageY ||
    e.clientY +
    (document.documentElement.scrollTop || document.body.scrollTop)
  return { left: mx, top: my }
}
