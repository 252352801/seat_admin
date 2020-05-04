<template>
  <pagoda-layout :side-menu="asideMenuData"
                 :before-tabs-change="beforeTabsChange"
                 @tabs-change="handleTabsChange"
                 url-key="path"
                 :side-menu-props="sideMenuProps"
                 :tabs-max="10">
    <!-- 头部的logo名称插槽 -->
    <div slot="header-left"
         slot-scope="scope">
      <img src="@/assets/images/logo.png"
           class="logo" />
      <span class="logo-text"
            v-show="!scope.collapse">Pagoda Seat</span>
      <!-- <span v-if="env"
            class="env-tag">{{ env }}</span> -->
    </div>
    <!-- 导航栏右侧的内容插槽，提供用户自定义 -->
    <div slot="header-right"
         class="bar-user">
      <el-dropdown @command="handleDropdownCommand"
                   v-if="user.employeeName">
        <a @click="$router.push({name:'user'})">
          <i class="iconfont icon-touxiang"
             style="font-size:20px;vertical-align:middle"></i>
          <span style="vertical-align:middle">{{ user.employeeName }}</span>
        </a>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item style="border-bottom:1px solid #ddd"
                            command="detail"
                            v-if="!isAdmin">
            <p> 工号：{{user.employeeCode}} </p>
            <p> 电话：{{user.telephone}} </p>
            <p v-if="user.postname"> 岗位：{{user.postname}} </p>
          </el-dropdown-item>
          <el-dropdown-item command="logout">
            <a>
              退出登录
              <i class="iconfont icon-logout"
                 style="font-size:14px;vertical-align:middle"></i>
            </a>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 内容插槽 -->
    <router-view />
  </pagoda-layout>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { leaveConfirm } from '@/router/leave-interceptor'
import api from '@/api'
import { IS_PERMIT_CTRL, IS_REQUIRED_LOGIN } from '@/config'
export default {
  name: 'Layout',
  components: {
  },
  data () {
    return {
      // 实际项目中的url字段应为路由路径，该处只是示例
      drawer: {
        visible: false,
        direction: 'ltr'
      },
      sideMenuProps: {
        collapse: true
      }
    }
  },
  computed: {
    ...mapGetters('console', ['menuData', 'userConfig', 'storeMenus']),
    ...mapGetters(['user', 'permitCtrl', 'appEvent', 'isAdmin']),
    ...mapGetters('console', ['menuData', 'collapse']),
    /** 权限过滤后的菜单数据 */
    permittedMenu () {
      return this.filterMenuByPermits(this.menuData)
    },
    operation () {
      return operationCode => {
        return this.permitCtrl.matchOperation(operationCode, 'console')
      }
    },
    asideMenuData () {
      if (IS_PERMIT_CTRL) {
        return this.permittedMenu
      } else {
        return this.menuData
      }
    }
  },
  watch: {
    $route () {
      this.resetMainScroll()
    },
    menuData: {
      deep: true,
      handler (val) {
        console.log('menuData', val)
      }
    },
    storeMenus (val) {
      console.log('storeMenus', val)
    }
  },
  async created () {
    this.init()
  },
  methods: {
    handleTabsChange (data) {
      // 在此处可以进行路由跳转
      if (data.url && data.url === '/') {
        this.$router.replace({ name: 'home' })
      } else {
        this.$router.replace({
          path: data.path,
          query: data.query,
          params: data.params
        })
      }
    },
    ...mapActions([
      'getUser',
      'removeToken',
      'getAssetsHost',
      'getImgHost'
    ]),
    ...mapMutations(['removeToken']),
    ...mapActions('console', [
      'toggleCollapse',
      'handleOpen',
      'handleClose',
      'login',
      'logout',
      'refresh',
      'refreshResource'
    ]),
    /**
     * 初始化
     */
    async init () {
      if (IS_REQUIRED_LOGIN) {
        await this.getUser()
      }
    },
    /**
     * 用权限过滤菜单
     * @param {array} menuData 未过滤的菜单数据
     * @returns Array
     */
    filterMenuByPermits (menuData) {
      if (menuData instanceof Array) {
        return menuData.filter(ele => {
          if (this.permitCtrl.matchPage(ele.routeName)) {
            if (ele.subMenu instanceof Array && ele.subMenu.length) {
              ele.subMenu = this.filterMenuByPermits(ele.subMenu)
            }
            return true
          }
        })
      }
      return []
    },
    async confirmLogout () {
      const confirm = await this.$confirm('确定要退出登录？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {})
      if (confirm === 'confirm') {
        const isSuperAdmin = this.isAdmin
        if (isSuperAdmin) {
          api.user.superAdminSignout()
        } else {
          this.logout()
        }
      }
    },
    async _refresh () {
      await this.refresh()
      window.reload()
    },
    async handleDropdownCommand (command) {
      switch (command) {
        case 'detail':
          this.$router.push({ name: 'user' })
          break
        case 'logout':
          this.confirmLogout()
          break
      }
    },
    beforeTabsChange (next) {
      leaveConfirm({}, this.$route, next)
    },
    resetMainScroll () {
      const mainElem = document.querySelector('.pagoda-layout__main')
      if (mainElem) {
        mainElem.scrollTop = 0
      }
    }
  }
}
</script>

<style lang="scss" type="text/scss">
.pagoda-layout {
  & > .el-header {
    .logo-text {
      margin-left: 15px;
      font-size: 14px;
      vertical-align: middle;
    }
    .user-head,
    .logo {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      vertical-align: middle;
    }
  }
}
.bar-user {
  font-size: 14px;
  color: #ddd;
  height: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
  a {
    padding: 0 20px;
    color: #ddd;
    &:hover {
      color: #fff;
    }
  }
}
.env-tag {
  color: #fff;
  display: inline-block;
  vertical-align: middle;
  font-size: 12px;
  padding: 0px 10px;
  background-color: $primary;
  height: auto;
  line-height: 24px;
  border-radius: 3px;
  position: relative;
  margin-left: 10px;
  &::before {
    content: "";
    display: block;
    border: 5px solid transparent;
    border-right-color: $primary;
    position: absolute;
    left: -10px;
    top: 50%;
    margin-top: -5px;
  }
}
.btn-nav-search {
  display: block;
  position: absolute;
  top: 0;
  right: 0;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 66px;
  cursor: pointer;
  opacity: 0.5;
  &:hover {
    opacity: 1;
  }
}
</style>
