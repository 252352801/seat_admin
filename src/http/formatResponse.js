import { isObj } from '@/utils'
/**
 * 格式化接口响应的数据
 * @param {*} response
 */
export default function (response) {
  const rd = isObj(response.data) ? response.data : {}
  const code = rd.code + ''
  const success = rd.status
  const message = isObj(rd.msg) ? rd.msg.error_msg || rd.msg.detail : rd.msg
  let body
  if (typeof rd.count === 'number') {
    body = {
      count: rd.count,
      items: rd.data
    }
  } else {
    body = rd.data || {}
  }
  const result = {
    response,
    code,
    success,
    message,
    body
  }
  return result
}
