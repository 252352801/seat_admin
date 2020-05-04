import { datetimeFormat } from '@/utils'
export function datetime (value, format) {
  return datetimeFormat(value, format || 'yyyy-MM-dd hh:mm:ss')
}
