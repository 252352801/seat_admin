<template>
  <div class="pad">
    <div class="clearfix mar-b-xs">
      <el-button class="pull-left"
                 type="primary"
                 size="mini"
                 @click="downloadLog">下载日志</el-button>
      <el-button class="pull-right"
                 type="text"
                 size="mini"
                 @click="showByModal">浮窗显示</el-button>
    </div>
    <div ref="logWrapper">
      <log-trace-box ref="logTraceBox"
                     :data="logData"
                     v-if="logContainerHeight"
                     :height="logContainerHeight"></log-trace-box>
    </div>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
<script>
import logTraceBox from '@/components/log-trace-box'
import { mapGetters } from 'vuex'
export default {
  name: 'log-trace',
  components: {
    logTraceBox
  },
  data () {
    return {
      currentProject: null,
      loading: false,
      logData: [],
      logContainerHeight: 0
    }
  },
  computed: {
    ...mapGetters(['appEvent'])
  },
  async created () {
    this.appEvent.trigger('hideLogTraceBtn')
    this.appEvent.trigger('syncLogData', data => {
      this.logData = data
    })
  },
  watch: {},
  mounted () {
    this.$nextTick(() => {
      this.logContainerHeight = this.computeLogContainerHeight()
    })
  },
  methods: {
    computeLogContainerHeight () {
      const maxHeight = 1000
      const minHeight = 400
      let height = 0
      if (this.$refs.logWrapper) {
        const rect = this.$refs.logWrapper.getBoundingClientRect()
        console.log(rect)
        const clientH = document.body.clientHeight
        console.log(clientH)
        const padBot = 30 // 底部预留空间
        height = clientH - rect.top - padBot
      }
      if (height < minHeight) {
        return minHeight
      } else if (height > maxHeight) {
        return maxHeight
      }
      return height
    },
    downloadLog () {
      this.$refs.logTraceBox.downloadLog()
    },
    showByModal () {
      this.appEvent.trigger(
        'showLogTraceBtn',
        this.$refs.logTraceBox.getData()
      )
      this.$router.push({ name: 'home' })
      this.$alert(
        '日志动态已切换至“浮窗显示”，您可以点击右下方的悬浮按钮（可拖动）再次查看',
        '浮窗显示',
        {
          confirmButtonText: '我知道了'
        }
      )
    }
  }
}
</script>
