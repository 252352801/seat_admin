<template>
  <res-editor
    mode="create"
    @success="handleSuccess"
    @error="handleError"
    :submitMethod="createSubmit"
    @cancel="goBack"
  ></res-editor>
</template>

<script>
import resEditor from '@/components/res-editor'
import goBackMixins from '@/mixins/goback'
export default {
  name: 'res-create',
  components: {
    resEditor
  },
  mixins: [goBackMixins],
  data () {
    return {}
  },
  computed: {
  },
  created () {},
  methods: {
    createSubmit (body) {
      console.log(body)
      return this.$api.res.create(body)
    },
    /**
     * 创建成功处理
     * @param {*} data
     */
    handleSuccess (data) {
      this.$message.success('已新增资源！')
      this.goBack()
    },
    /**
     * 创建失败处理
     * @param {string} msg 错误信息
     */
    handleError (msg) {
      this.$message.error(msg || '新增资源失败！')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
