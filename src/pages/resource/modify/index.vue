<template>
  <res-editor
    mode="modify"
    :id="$route.params.id"
    @success="handleSuccess"
    @error="handleError"
    :submitMethod="modifySubmit"
    @cancel="goBack"
  ></res-editor>
</template>

<script>
import resEditor from '@/components/res-editor'
import goBack from '@/mixins/goback'
export default {
  name: 'res-modify',
  components: {
    resEditor
  },
  mixins: [goBack],
  data () {
    return {}
  },
  computed: {
  },
  created () {},
  methods: {
    modifySubmit (id, body) {
      return this.$api.res.update(id, body)
    },
    /**
     * 创建成功处理
     * @param {*} data
     */
    handleSuccess (data) {
      this.$message.success('资源信息已修改！')
      this.goBack()
    },
    /**
     * 创建失败处理
     * @param {string} msg 错误信息
     */
    handleError (msg) {
      this.$message.error(msg || '修改资源信息失败！')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
