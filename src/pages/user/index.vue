<template>
  <pagoda-detail-layout-v1 content-title="登录用户信息"
                           @back="goBack">
    <template slot="content-form">
      <div>
        <el-form class="form-detail">
          <el-form-item label="用户名称">
            {{user.employeeName}}
          </el-form-item>
          <el-form-item label="用户编号">
            {{user.employeeCode}}
          </el-form-item>
          <el-form-item label="手机号">
            {{user.telephone}}
          </el-form-item>
          <el-form-item label="部门">
            {{user.deptname||'--'}}
          </el-form-item>
          <el-form-item label="岗位">
            {{user.postname||'--'}}
          </el-form-item>
          <el-form-item label="OAID">
            {{user.oaid||'--'}}
          </el-form-item>
          <div>
            <el-form-item label="密钥">
              <div class="keys-container"
                   v-if="(user.access_key&&user.secret_key)">
                <table border>
                  <tbody>
                    <tr>
                      <td>access_key</td>
                      <td>
                        <div class="key-content">
                          <input :value="accessKey"
                                 :type="showAccessKey?'text':'password'"
                                 ref="accessKey"
                                 readonly />
                          <div class="key-btns">
                            <span class="iconfont icon-Eyeblind"
                                  v-if="showAccessKey"
                                  @click="showAccessKey=false"
                                  title="隐藏"></span>
                            <span class="iconfont icon-Eyevision"
                                  v-if="!showAccessKey"
                                  @click="showAccessKey=true"
                                  title="查看"></span>
                            <span class="iconfont icon-copy"
                                  v-if="showAccessKey"
                                  @click="copy('accessKey')"
                                  title="复制"></span>
                          </div>
                        </div>

                      </td>
                    </tr>
                    <tr>
                      <td>secret_key</td>
                      <td>
                        <div class="key-content">
                          <input :value="secretKey"
                                 :type="showSecretKey?'text':'password'"
                                 ref="secretKey"
                                 readonly />
                          <div class="key-btns">
                            <span class="iconfont icon-Eyeblind"
                                  v-if="showSecretKey"
                                  @click="showSecretKey=false"
                                  title="隐藏"></span>
                            <span class="iconfont icon-Eyevision"
                                  v-if="!showSecretKey"
                                  @click="showSecretKey=true"
                                  title="查看"></span>
                            <span class="iconfont icon-copy"
                                  v-if="showSecretKey"
                                  @click="copy('secretKey')"
                                  title="复制"></span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div>
                <a class="btn-generate text-primary"
                   @click="generate"
                   v-if="!generating&&!generatedKeys&&operation('generate-cipher')">生成</a>
                <a class="loading-generate text-disabled"
                   v-if="generating">正在生成...</a>
              </div>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </template>
    <template slot="content-btn">
    </template>
  </pagoda-detail-layout-v1>
</template>
<style lang="scss" scoped>
.btn-generate {
  font-size: 12px;
  line-height: 20px;
  padding: 0 15px;
  cursor: pointer;
}
.loading-generate {
  font-size: 12px;
}
.keys-container {
  table,
  table td {
    white-space: nowrap;
    padding: 8px 15px;
    border: 1px solid #ddd;
  }
  table td:first-child {
    background-color: #f5f5f5;
  }
}
.key-content {
  display: inline-block;
  padding-right: 40px;
  position: relative;
  &:hover {
    .key-btns {
      display: block;
    }
  }
  input {
    border: none;
    outline: none;
    background-color: transparent;
  }
}
.key-btns {
  width: 40px;
  position: absolute;
  right: 0;
  top: 0;
  text-align: right;
  display: none;
  span {
    opacity: 0.75;
    cursor: pointer;
    padding: 4px 0 4px 0;
    &:first-child {
      font-size: 18px;
    }
    &:hover {
      opacity: 1;
    }
  }
}
</style>
<script>
import goBack from '@/mixins/goback'
import { mapGetters, mapMutations } from 'vuex'
import { isObj } from '@/utils'
import api from '@/api'
export default {
  mixins: [goBack],
  data () {
    return {
      generating: false,
      showAccessKey: false,
      showSecretKey: false
    }
  },
  computed: {
    ...mapGetters(['user']),
    accessKey () {
      if (this.user && this.user.access_key) {
        return this.user.access_key
      } else {
        return '--'
      }
    },
    secretKey () {
      if (this.user && this.user.secret_key) {
        return this.user.secret_key
      } else {
        return '--'
      }
    },
    generatedKeys () {
      return (this.user && this.user.access_key) || (this.user && this.user.secret_key)
    },
    ...mapGetters(['permitCtrl']),
    operation () {
      return operationCode => {
        return this.permitCtrl.matchOperation(operationCode, this.$route.name)
      }
    }
  },
  methods: {
    ...mapMutations(['setUser']),
    async generate () {
      this.generating = true
      const res = await api.user.generateKeys(true).catch(err => err)
      this.generating = false
      if (isObj(res) && res.access_key && res.secret_key) {
        const user = {
          ...this.user,
          access_key: res.access_key,
          secret_key: res.secret_key
        }
        this.setUser(user)
      }
    },
    copy (keyName) {
      if (this.$refs[keyName]) {
        this.$refs[keyName].select()
        document.execCommand('Copy')
        this.$message.success('复制成功!')
      }
    }
  }
}
</script>
