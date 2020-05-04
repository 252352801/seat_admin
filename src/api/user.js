import { login } from '@/http/auth'
import http from '@/http'
import cookie from '@/utils/cookie-manage'
import router from '@/router'
import host from '@/http/host'
const { request } = http
export default {
  login: login,
  logout: () => {
    const token = cookie.get('token')
    const session = cookie.get('session')
    cookie.remove('token')
    cookie.remove('session')
    const url = `${host}/logout/?token=${token}&session_key=${session}`
    location.href = url
  },
  getUserInfo: () => request({
    url: '/api/v1/members/list',
    method: 'get'
  }),
  generateKeys: addKey => request({
    url: '/api/v1/cmdb/members/list/',
    method: 'post',
    data: {
      add_key: addKey
    }
  }),
  superAdminSignin: data => request({
    url: '/super/login/',
    method: 'post',
    data
  }),
  superAdminSignout: () => {
    const token = cookie.get('token')
    request({
      url: `/super/logout/?token=${token}`
    })
    cookie.remove('token')
    router.replace({ name: 'signin' })
  },
  getFunctions: () => request({
    url: '/api/v1/cmdb/rbac/function/list/',
    method: 'get'
  })
}
