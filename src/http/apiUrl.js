import host from './host'
/** api url */
export const apiUrl = path => {
  const hostAddr =
    host.indexOf('http') >= 0
      ? host
      : location.protocol + '//' + location.host + host
  let addr = hostAddr.replace(/\/+$/, '') + '/'
  if (path && typeof path === 'string') {
    addr = addr + path.replace(/^\/+/, '')
  }
  return addr
}
