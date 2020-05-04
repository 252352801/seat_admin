<template>
  <router-view />
</template>

<script>
import { mapActions } from 'vuex'
import cookie from '@/utils/cookie-manage'
import permitCtrl from '@/utils/permitctrl'
import { IS_PERMIT_CTRL } from '@/config'
export default {
  name: '',
  computed: {},
  data () {
    return {}
  },
  async created () {
    this.initToken()
    if (IS_PERMIT_CTRL) {
      const data = await this.getLoginUserOperations().catch(() => [])
      const permitData = data
      permitCtrl.set(permitData, true)
    }
  },
  methods: {
    ...mapActions('console', ['getLoginUserOperations']),
    initToken () {
      const search = location.search
      const tokenMatch = search.match(/[?&]token=[^&]+/)
      const token = tokenMatch ? tokenMatch[0].split('=')[1] : ''
      const sessionKeyMatch = search.match(/[?&]session_key=[^&]+/)
      const sessionKey = sessionKeyMatch ? sessionKeyMatch[0].split('=')[1] : ''
      if (token) {
        cookie.set('token', token)
      }
      if (sessionKey) {
        cookie.set('session', sessionKey)
      }
      location.search = ''
    }
  }
}
</script>

<style></style>
