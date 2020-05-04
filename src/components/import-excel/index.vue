<template>
  <el-dialog :title="title"
             @close="close"
             width="500px"
             :visible.sync="dialogVisible">
    <slot></slot>
    <el-upload class="import-drag-box"
               ref="upload"
               drag
               :headers="{
                 'Authorization':`Token ${this.token}`
               }"
               :auto-upload="autoUpload"
               :action="importUrl"
               :show-file-list="true"
               :on-success="onSuccess"
               :on-error="onError"
               :limit="limit"
               :on-exceed="onExceed"
               :data="submitData"
               :on-remove="onRemove"
               :before-upload="beforeUpload"
               :on-change="onChange">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip"
           slot="tip">只能上传excel文件</div>
    </el-upload>
    <ul>

    </ul>
    <span slot="footer"
          class="dialog-footer">
      <el-button type="text"
                 @click="downloadTemplate"
                 style="float:left">模版下载</el-button>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary"
                 v-if="!autoUpload"
                 :loading="submitted"
                 @click="submit()">{{importButtonText}}</el-button>
    </span>
    <el-dialog width="520px"
               title="导入错误"
               :visible.sync="errorListVisible"
               append-to-body>
      <el-table stripe
                :data="errorList"
                border>
        <el-table-column label="错误行"
                         width="80"
                         prop="row"></el-table-column>
        <el-table-column label="错误信息"
                         prop="message"></el-table-column>
      </el-table>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="errorListVisible=false"
                   type="primary">确定</el-button>
      </span>
    </el-dialog>
  </el-dialog>
</template>
<style lang="scss">
.import-drag-box {
  .el-upload-dragger,
  .el-upload {
    width: 100%;
  }
  .el-upload__tip {
    color: #999;
  }
}
</style>

<script>
// import api from '@/api/index'
import { download, isExcel } from '@/utils'
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
import formatResponse from '@/http/formatResponse'
import cookie from '@/utils/cookie-manage'
export default {
  name: 'import-excel',
  props: {
    /** 标题 */
    title: {
      type: String,
      default: () => {
        return '导入'
      }
    },
    /** 自动上传 */
    autoUpload: {
      type: Boolean,
      default: () => false
    },
    importButtonText: {
      type: String,
      default: () => {
        return '导 入'
      }
    },
    /** 是否显示 */
    visible: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    /** 最大数量 */
    limit: {
      type: Number,
      default: () => 1
    },
    /** 模版地址 */
    templateUrl: {
      type: String,
      default: () => {
        return ''
      }
    },
    /** 模版文件名称 */
    templateName: {
      type: String,
      default: () => {
        return '导入模版'
      }
    },
    /** 提交地址 */
    importUrl: {
      type: String,
      default: () => {
        return ''
      }
    },
    /** 一起提交的数据 */
    submitData: {
      type: Object,
      default: () => null
    },
    beforImport: {
      type: Function | Promise,
      default: null
    },
    /**
     * 格式化错误数据 失败时调用，传入返回的错误数据
     * 需格式化为[{row:'错误行',message:'错误信息'}] 格式的数据
     */
    errorFormat: {
      type: Function | Promise,
      default: null
    }
  },
  data () {
    return {
      /** 是否显示 */
      dialogVisible: false,
      /** 是否在提交 */
      submitted: false,
      /** 错误显示 */
      errorListVisible: false,
      /** 错误列表 */
      errorList: [],
      token: cookie.get('token')
    }
  },
  computed: {
    ...mapGetters(['token'])
  },
  created () {},
  watch: {
    visible (val) {
      if (!val) {
        this.clearFiles()
      }
      this.dialogVisible = !!val
      if (this.dialogVisible) {
        this.$emit('open')
      }
    }
  },
  methods: {
    /** 打开 */
    open () {
      this.dialogVisible = true
      this.$emit('update:visible', true)
      this.$emit('open')
    },
    /** 关闭 */
    close () {
      this.clearFiles()
      this.dialogVisible = false
      this.$emit('update:visible', false)
      this.$emit('close')
    },
    /** 下载模版 */
    downloadTemplate () {
      this.$emit('downloadTemplate')
      if (this.templateUrl) {
        download(this.templateUrl, this.templateName)
      }
    },
    /** 文件选择改变时 */
    onChange (file, fileList) {
      this.$emit('change', file, fileList)
    },
    /** 文件删除时 */
    onRemove (file, fileList) {
      this.$emit('remove', file, fileList)
    },
    /** 超出数量 */
    onExceed (file, fileList) {
      this.$message.error(`最多同时导入${this.limit}个文件！`)
      this.$emit('exceed', file, fileList)
    },
    beforeUpload (file, fileList) {
      if (isExcel(file.name)) {
        return true
      } else {
        this.$message.error(`文件${file.name}不是excel文件！`)
        return false
      }
    },
    clearFiles () {
      this.$refs.upload.clearFiles()
    },
    /** 上传成功时 */
    onSuccess (response, file, fileList) {
      const res = formatResponse({
        status: 200,
        data: response
      })
      if (res.success) {
        this.$emit('success', response, file, fileList)
      } else {
        if (this.limit === 1) {
          this.clearFiles()
        }
        if (typeof this.errorFormat === 'function') {
          const errorList = this.errorFormat(res.body)
          if (errorList instanceof Array && errorList.length) {
            this.errorList = errorList
            this.errorListVisible = true
          } else {
            this.$emit('error', res.message, file, fileList)
            Message.error(res.message)
          }
        } else {
          this.$emit('error', res.message, file, fileList)
          Message.error(res.message)
        }
      }
    },
    /** 上传失败时 */
    onError (e, file, fileList) {
      Message.error(e)
      this.$emit('error', e, file, fileList)
    },
    /** 提交 */
    submit () {
      let action = this.beforImport
      if (typeof action === 'function') {
        action = action()
      }
      if (action instanceof Promise) {
        action.then(data => {
          this.$refs.upload.submit()
        })
      } else if (action || action === undefined || action === null) {
        this.$refs.upload.submit()
      }
    }
  }
}
</script>
