import http from '@/http'
import api from '@/api'
import cookieManage from '@/utils/cookie-manage'
import dictionary from './dictionary'
import { PageTag } from '@/components/page-tag/pagetag'
import { download, getfilenameExtension, isObj, get } from '@/utils'
import { AppEvent } from '@/utils/app-event'

import { generateGetters, generateMutations } from '@/utils/factories/generate'
import permitCtrl from '@/utils/permitctrl'
const appEvent = new AppEvent()
const state = {
  /** 字典对象 */
  dictionary: dictionary,
  /** 全局事件管理器 */
  appEvent: appEvent,
  /** 页签 */
  pageTag: new PageTag(),
  /** token */
  token: '',
  /** token有效时间（ms） */
  tokenExpires: +cookieManage.get('admin_tokenExpires') || 0,
  /** 登录用户 */
  user: (() => {
    let user = {}
    try {
      user = JSON.parse(localStorage.getItem('user')) || {}
    } catch (err) {
      console.log(err)
    }
    return user
  })(),
  /** 是否是超管 用于退出登录时调用不同的接口 */
  isAdmin: false,
  /** 权限控制 */
  permitCtrl: permitCtrl
}
const getters = {
  ...generateGetters(state),
  /** 是否登录 */
  isLogin (state) {
    // return isObj(state.user)
    return location.search.match(/[?&]token=[^&]+/) || cookieManage.get('token')
  },
  /** 页码选项 */
  pageSizes (state) {
    return [10, 20, 30, 50, 100, 200]
  },
  storeMenus (state) {
    return get(state, 'userConfig.storeMenus') || []
  }
}
const mutations = {
  ...generateMutations(state),
  setToken (state, { value, expires }) {
    state.token = value
    state.tokenExpires = expires
  },
  saveToken (state, { value, expires } = {}) {
    cookieManage.set(
      'admin_token',
      value || state.token,
      expires || state.tokenExpires
    )
    cookieManage.set(
      'admin_tokenExpires',
      expires || state.tokenExpires,
      expires || state.tokenExpires
    )
  },
  setUser (state, payload) {
    state.user = payload
  },
  saveUser (state, payload) {
    if (localStorage) {
      try {
        localStorage.setItem('user', JSON.stringify(payload))
      } catch (err) {
        console.log(err)
      }
    }
  },
  removeToken (state, payload) {
    cookieManage.remove('admin_token')
    state.token = ''
  },
  setIsAdmin (state, data) {
    state.isAdmin = data
  }
}
const actions = {
  /**
   * 获取用户信息
   * @param {*} context
   * @param {*} parameter
   */
  async getUser ({ commit }, parameter) {
    return api.user.getUserInfo()
      .then(data => {
        console.log(data)
        const user = data
        commit('setUser', user)
        return user
      })
      .catch(err => {
        console.log(err.code)
        console.log(err.config)
      })
  },
  /**
   * 获取字典表
   * @param {*} context
   * @param {*} parameter
   */
  getDictionary (context, parameter) {
    const dictName = parameter
    return new Promise((resolve, reject) => {
      const dictionary = context.state.dictionary // 字典实例
      const dictData = dictionary.get(dictName) // 字典数据
      if (dictData) {
        resolve({
          success: true,
          body: dictData
        })
      } else {
        if (!dictionary.isLoaded(dictName)) {
          // 避免重复请求相同的字典
          dictionary.setLoaded(dictName)
        } else {
          dictionary.onUpdate(dictName, data => {
            resolve({
              success: true,
              body: data
            })
          })
        }
      }
    }).then(res => {
      const { body } = res
      if (res.success && body && body instanceof Array) {
        dictionary.set(dictName, body)
        return Promise.resolve(body)
      }
    })
  },
  /**
   * 获取字典表
   * @param {*} context
   * @param {*} parameter
   */
  async fetchDictionary (context, parameter) {
    const dictName = parameter
    const dictionary = context.state.dictionary // 字典实例
    let dictData = dictionary.get(dictName) // 字典数据
    if (dictData instanceof Array && dictData.length) {
      return dictData
    } else {
      if (!dictionary.isLoaded(dictName)) {
        // 避免重复请求相同的字典
        dictionary.setLoaded(dictName)
        dictData = await api.common.getDictionary(dictName).catch(() => null)
        console.log(dictData)
        let dictItems = []
        if (isObj(dictData)) {
          dictItems = Object.entries(dictData).map(ele => {
            const numKey = +ele[0]
            const key = Number.isNaN(numKey) ? ele[0] : numKey
            const value = ele[1]
            return {
              key,
              value
            }
          })
          dictionary.set(dictName, dictItems)
        }
        return dictItems
      } else {
        const updatePromise = new Promise((resolve, reject) => {
          dictionary.onUpdate(dictName, data => {
            resolve(resolve)
          })
        })
        const dictData = await updatePromise
        return dictData
      }
    }
  },
  /**
   * 设置token
   * @param {*} context
   * @param {*} parameter
   */
  setToken (context, { value, expires } = {}) {
    const payload = {
      value: value,
      expires: expires
    }
    context.commit('setToken', payload)
    context.commit('saveToken', payload)
  },
  /**
   * 设置（并保存）用户数据
   * @param {*} context
   * @param {*} parameter
   */
  setUser (context, parameter) {
    context.commit('setUser', parameter)
    context.commit('saveUser', parameter)
  },
  /**
   * 刷新token
   * @param {*} context
   * @param {*} parameter
   */
  refreshToken (context, parameter) {
    context.commit('saveToken')
  },
  /**
   * 异步下载
   * @param {*} context
   * @param {*} param1
   */
  async ajaxDownload (context, { request, data, url, fileName }) {
    let res
    if (request) {
      res = await request(data)
    } else {
      res = await http.get(url, { responseType: 'blob', format: false })
    }
    if (res.status === 200) {
      const reader = new FileReader()
      reader.readAsDataURL(res.data) // 转换为base64，可以直接放入a表情href
      reader.onload = function (e) {
        const extension = getfilenameExtension(fileName) // 文件后缀名
        let resFileName = ''
        if (!fileName || !extension) {
          const cd = res.headers['content-disposition']
          console.log(cd)
          const match = cd ? cd.match(/filename=[^;]+/) : null
          if (match) {
            resFileName = match[0].split('=')[1].replace(/"/g, '')
            resFileName = unescape(resFileName.replace(/\\/g, '%'))
          }
        }
        console.log(fileName)
        if (fileName && !extension) {
          fileName += getfilenameExtension(resFileName)
        }
        download(e.target.result, fileName || resFileName)
      }
    }
  }
}
export default {
  state,
  getters,
  mutations,
  actions
}
