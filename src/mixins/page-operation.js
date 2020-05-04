import permitCtrl from '@/utils/permitctrl'
import { IS_PERMIT_CTRL } from '@/config'
export default {
  computed: {
    pageOperation () {
      return (pageCode, operationCode) => {
        return IS_PERMIT_CTRL ? permitCtrl.matchOperation(operationCode, pageCode) : {}
      }
    }
  }
}
