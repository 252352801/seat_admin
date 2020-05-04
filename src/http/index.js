// import {serializeURLParams} from '@/utils'
import axios from 'axios'
import responseFormat from './formatResponse'
import host from './host'
import store from '@/store'
import { serializeURLParams, isAxiosRequestTimeout } from '../utils'
import cookie from '@/utils/cookie-manage'
import { login } from './auth'
import { Message } from 'element-ui'
const instance = axios.create({
  baseURL: host,
  timeout: 30000, // 请求超时时间
  // withCredentials: true,
  headers: { 'Content-Type': 'application/json;charset=UTF-8' },
  validateStatus: (status) => {
    const mock = location.search.match(/[?&]token=[^&]+/)
    return mock ? true : (status >= 200 && status < 300)
  }
})
// 请求拦截
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    // url 查询key value拼接
    if (config.query && typeof config.query === 'object') {
      const qstr = serializeURLParams(config.query, ['', null, undefined])
      config.url = config.url + (qstr ? '?' + qstr : '')
    }
    const token = cookie.get('token')
    let headers = Object.assign({}, config.headers)
    if (token) {
      headers = Object.assign({}, headers, { Authorization: `Token ${token}` })
    }
    config.headers = headers
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

/**
 * 刷新token
 */
const refreshToken = (() => {
  let timer
  const delay = 3000
  return () => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      store.dispatch('refreshToken')
    }, delay)
  }
})()
// 响应拦截
instance.interceptors.response.use(
  function (response) {
    if (response.config.format === false) {
      // 不格式化
      return response
    }
    // 格式化
    const res = responseFormat(response)
    // const code = readObj(response, 'data.code')
    const unAuth = (res.code === '403' || res.code === '401')
    if (unAuth) {
      // 未授权 跳转登录页
      login()
    } else {
      // 每次通过授权时刷新token
      const freshIgnore = [] // 请求后不执行刷新的url
      if (!freshIgnore.some(ele => response.config.url.indexOf(ele) >= 0)) {
        refreshToken()
      }
    }
    if (res.success) {
      return res.body
    } else {
      return Promise.reject(res.message)
    }
  },
  function (error) {
    const isTimeout = isAxiosRequestTimeout(error)
    let errMsg = ''
    if (isTimeout) {
      errMsg = '请求超时，请稍后重试'
    } else {
      errMsg = '请求失败，请稍后重试！'
    }
    Message.warning(errMsg)
    return Promise.reject(error)
  }
)
// export const CancalToken = axios.CancelToken
export default instance
