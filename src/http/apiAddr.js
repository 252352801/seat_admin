import host from './host'
/** api地址 */
export const apiAddr = (() => {
  let hostAddr =
    host.indexOf('http') >= 0
      ? host
      : location.protocol + '//' + location.host + host
  if (!(/\/$/.test(apiAddr))) { // 如果末尾不是 /
    hostAddr = hostAddr + '/'
  }
  return hostAddr
})()
