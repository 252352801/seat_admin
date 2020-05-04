import permitCtrl from '@/utils/permitctrl'
import { IS_PERMIT_CTRL } from '@/config'
export default {
  computed: {
    anyOperation () {
      return (...args) => {
        return IS_PERMIT_CTRL ? permitCtrl.isAnyOperation(this.$route.name, ...args) : true
      }
    }
  }
}
