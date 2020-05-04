import { leaveConfirm } from '@/router/leave-interceptor'
export default {
  methods: {
    async goBack () {
      leaveConfirm({}, this.$route, () => {
        this.$router.go(-1)
        this.$pagoda.$emit('layout:remove-current-tab')
      })
    }
  }
}
