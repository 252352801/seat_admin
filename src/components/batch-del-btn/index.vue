<template>
  <div class="batch-del-btn">
    <el-button @click="remove"
               type="info"
               plain>{{buttonText}}</el-button>
    <el-dialog :visible="resultVisible"
               title="删除结果"
               top="5vh"
               @close="hideResult">
      <div>
        <h2></h2>
      </div>
      <el-collapse v-model="activeName">
        <el-collapse-item name="success">
          <template slot="title">
            成功 <span class="res-count">{{successCount}}</span> {{this.unit}}
          </template>
          <el-table :data="successResult"
                    v-if="successResult.length&&resultFields.length">
            <el-table-column v-for="(col,index) of resultFields"
                             :key="index"
                             :label="col.label"
                             :prop="`item.${col.value}`"></el-table-column>
          </el-table>
        </el-collapse-item>
        <el-collapse-item name="fail">
          <template slot="title">
            失败 <span class="res-count">{{failCount}}</span> {{this.unit}}
          </template>
          <el-table :data="failResult"
                    v-if="failResult.length&&resultFields.length">
            <el-table-column v-for="(col,index) of resultFields"
                             :key="index"
                             :label="col.label"
                             :prop="`item.${col.value}`" width="200px"></el-table-column>
            <el-table-column label="错误信息"
                             prop="errMsg"
                             show-overflow-tooltip></el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
    </el-dialog>
  </div>
</template>
<style scoped lang="scss">
.batch-del-btn {
  display: inline-block;
  margin: 0 10px;
}
.res-count {
  color: #ff6700;
  padding: 0 10px;
}
</style>
<script>
export default {
  name: 'batch-del-btn',
  props: {
    /** 按钮文字 */
    buttonText: {
      type: String,
      default: () => '删除'
    },
    /** 要删除的项 */
    items: {
      type: Array,
      default: () => []
    },
    /** 单位 */
    unit: {
      type: String,
      default: () => '个'
    },
    /** 选中条目的名称 */
    itemName: {
      type: String,
      default: () => ''
    },
    /** 结果字段展示 */
    resultFields: {
      type: Array,
      default: () => [
        // {
        //   label: '表头',
        //   value: '读取的属性key'
        // }
      ]
    },
    /** 是否需要确认 */
    wouldConfirm: {
      type: Boolean,
      default: () => true
    },
    /** 提交方法 返回一个Promise实例 */
    submitMethod: {
      type: Function,
      default: () => undefined
    },
    confirmText: {
      type: Function | String,
      default: () => ''
    }
  },
  data () {
    return {
      resultVisible: false,
      result: [],
      activeName: ''
    }
  },
  computed: {
    successResult () {
      return this.result.filter(ele => ele.success)
    },
    failResult () {
      return this.result.filter(ele => !ele.success)
    },
    successCount () {
      return this.result.filter(ele => ele.success).length
    },
    failCount () {
      return this.result.filter(ele => !ele.success).length
    }
  },
  methods: {
    getConfirmText () {
      let confirmText = ''
      if (this.confirmText) {
        confirmText = this.confirmText
        if (typeof this.confirmText === 'function') {
          confirmText = this.confirmText(this.items)
        }
      }
      if (!confirmText) {
        confirmText = `确定删除${
          this.items.length === 1
            ? '该'
            : `选中的${this.items.length}${this.unit}`
        }${this.itemName}?`
      }
      return confirmText
    },
    async confirm () {
      const confirmText = this.getConfirmText()
      const confirm = await this.$confirm(confirmText, '删除确认', {
        type: 'warning'
      }).catch(() => null)
      return confirm
    },
    async remove () {
      if (this.items instanceof Array && this.items.length > 0) {
        if (this.wouldConfirm) {
          const confirm = await this.confirm()
          if (!confirm) return
        }
        if (typeof this.submitMethod === 'function') {
          const promises = this.items.map(item =>
            this.submitMethod(item).then(
              () => {
                return { success: true, item }
              },
              msg => {
                return { success: false, item, errMsg: msg }
              }
            )
          )
          const res = await Promise.all(promises).catch(err => {
            throw new Error(err)
          })
          if (res) {
            this.handleRes(res)
          }
        }
      } else {
        this.$message.warning(`请先勾选${this.itemName}`)
      }
    },
    handleRes (res) {
      const resList = [...res]
      if (resList.every(ele => ele.success)) {
        // 全部成功
        this.$message.success(
          `已删除${resList.length}${this.unit}${this.itemName}!`
        )
        this.$emit('success', resList)
      } else if (resList.some(ele => !ele.success)) {
        // 包含失败
        this.showResult(resList)
      }
      this.$emit('complete', resList)
    },
    showResult (resItems) {
      this.result = resItems
      console.log(resItems)
      this.resultVisible = true
    },
    hideResult () {
      this.resultVisible = false
      this.result = []
    }
  },
  created () {
    console.log(this.resultFields)
    console.log()
  }
}
</script>
