import { apiAddr } from '@/http/apiAddr'
import cookie from '@/utils/cookie-manage'
export const login = () => {
  cookie.clear()
  if (window && window.location) {
    window.location.href = `${apiAddr}login/`
  }
}
