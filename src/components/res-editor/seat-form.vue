<template>
  <el-dialog :visible="visible"
             @close="$emit('cancel')"
             :title="title">
    <div v-loading="loading">
      <el-form class="el-form-reset-block"
               ref="form"
               :rules="isDetail?formRules:null"
               :model="form">
        <el-form-item label="座位名称"
                      prop="name">
          <el-input placeholder="座位名称"
                    v-model="form.name"
                    v-if="!isDetail"></el-input>
          <span v-if="isDetail">{{form.name}}</span>
        </el-form-item>
        <el-form-item label="座位备注"
                      prop="mark">
          <el-input placeholder="座位描述"
                    v-model="form.mark"
                    v-if="!isDetail"></el-input>
          <span v-if="isDetail">{{form.mark}}</span>
        </el-form-item>
        <el-form-item label="状态"
                      prop="status">
          <el-radio-group v-model="form.status"
                          v-if="!isDetail">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
          <span v-if="isDetail">
            {{form.status?'启用':'禁用'}}
          </span>
        </el-form-item>
        <el-form-item  v-if="!isDetail">
          <el-button type="primary"
                     @click="submit"
                     :loading="submitted">{{mode==='create'?'提交':'保存'}}</el-button>
          <el-button @click="$emit('cancel')">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>
<style scoped lang="scss">
.single-form {
  max-width: 800px;
  margin: 20px auto 0;
}
</style>
<script>
import goback from '@/mixins/goback'
import { isObj } from '@/utils'
// import api from '@/api'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    mode: {
      type: 'create' | 'modify' | 'detail',
      default: () => 'create'
    },
    id: {
      type: Number,
      default: () => undefined
    },
    /** 提交的方法 需返回一个Promise */
    submitMethod: {
      type: Function,
      default: () => undefined
    }
  },
  mixins: [goback],
  data () {
    return {
      loading: false,
      formRules: {
        name: [
          { required: true, message: '请输入英文名称', trigger: 'blur' }
          //   generateElementUIValidator({
          //     label: '英文名称',
          //     rule: fieldRules.envName,
          //     uniqueValite: async val => {
          //       // 唯一校验
          //       const query = {
          //         verify_env_name: val
          //       }
          //       const res = await api.env.getList(query).catch(err => {
          //         throw new Error(err)
          //       })
          //       const isUnique = !testIsDuplicate({
          //         list: res.items,
          //         keyField: 'id',
          //         valueField: 'env_name',
          //         selfKey: this.mode === 'modify' ? this.form.id : '',
          //         testValue: val
          //       })
          //       return isUnique
          //     },
          //     fetchSuggestion: async val => {
          //       const res = await api.common.getFieldValueSuggestion({
          //         prefix: val,
          //         data_type: 'EnvsModel'
          //       }).catch(() => '')
          //       return Promise.resolve(res ? `${val}已被占用，推荐${res}` : res)
          //     }
          //   })
        ],
        mark: [
          {
            required: true,
            message: '请输入中文名称',
            trigger: 'blur'
          }
          //   generateElementUIValidator({
          //     uniqueValite: async val => {
          //       // 唯一校验
          //       const query = {
          //         verify_env_mark: val
          //       }
          //       const res = await api.env.getList(query).catch(err => {
          //         throw new Error(err)
          //       })
          //       const isUnique = !testIsDuplicate({
          //         list: res.items,
          //         keyField: 'id',
          //         valueField: 'env_mark',
          //         selfKey: this.mode === 'modify' ? this.form.id : '',
          //         testValue: val
          //       })
          //       return isUnique
          //     }
          //   })
        ]
      },
      form: {
        id: undefined,
        name: '',
        // desc: '',
        mark: '',
        status: 1
      },
      submitted: false
    }
  },
  computed: {
    title () {
      const titletMap = {
        create: '新增座位',
        modify: '座位修改',
        detail: '座位详情'
      }
      return titletMap[this.mode]
    },
    isDetail () {
      return this.mode === 'detail'
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.init()
      }
    }
  },
  methods: {
    fetchDetail (id) {
      return this.$api.seat.getDetail(id)
    },
    async init () {
      if (this.mode !== 'create' && this.id) {
        console.log(this.id)
        this.loading = true
        const data = await this.fetchDetail(this.id)
        this.loading = false
        if (isObj(data)) {
          this.initForm(data)
        }
      }
    },
    initForm (obj) {
      this.form.id = obj.id
      this.form.name = obj.name
      this.form.mark = obj.mark
      // this.form.desc = obj.env_desc
      this.form.status = obj.status
    },
    async submit () {
      const valid = await this.$refs.form.validate().catch(() => {})
      if (!valid) {
        console.log(this.$refs.form)
        return
      }
      const fd = this.form
      const body = {
        mark: fd.mark,
        name: fd.name,
        // env_desc: fd.desc,
        status: fd.status
      }
      if (this.mode === 'modify') {
        body['id'] = fd.id
      }
      console.log(this.submitMethod)
      if (typeof this.submitMethod === 'function') {
        this.submitted = true
        const res =
          this.mode === 'create'
            ? this.submitMethod(body, this.mode)
            : this.submitMethod(body, this.mode, body.id)
        if (res && typeof res === 'object' && typeof res.then === 'function') {
          res
            .then(data => {
              this.submitted = false
              this.$emit('success', data, this.mode)
              this.$emit('complete', data, this.mode)
            })
            .catch(err => {
              this.submitted = false
              this.$emit('error', err, this.mode)
              this.$emit('complete', body, this.mode)
            })
        } else {
          this.submitted = false
        }
      } else {
        this.$emit('complete', body, this.mode)
      }
    }
  },
  async created () {}
}
</script>
