import permitCtrl from '@/utils/permitctrl'
import { IS_PERMIT_CTRL } from '@/config'
export default {
  computed: {
    operation () {
      return operationCode => {
        return IS_PERMIT_CTRL ? permitCtrl.matchOperation(operationCode, this.$route.name) : {}
      }
    }
  }
}
