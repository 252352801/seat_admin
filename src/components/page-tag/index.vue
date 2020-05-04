<template>
  <div class="page-tag">
    <div
      class="page-tag-item"
      v-for="(tag, index) of items"
      :key="index"
      @click="
        pageTag.activate(tag)
        pageTag.go(tag)
      "
      v-bind:class="{ active: tag.active }"
      @contextmenu="handleContextMenu($event, index, tag)"
    >
      <span>{{ tag.label }}</span>
      <span
        class="page-tag-btn-remove iconfont icon-delete"
        title="删除"
        @click.stop="removeTag(tag)"
      ></span>
    </div>
    <!--
      <el-button-group class="page-tag">
        <el-button
          class="page-tag-item"
          v-for="(tab, index) of items"
          :key="index"
          :type="tab.active ? 'primary' : null"
          @click="go(tab)"
          size="mini"
          >{{ tab.label
          }}<span
            class="iconfont icon-delete"
            title="删除"
            @click.stop="remove(index)"
          ></span
        ></el-button>
      </el-button-group>
    -->
    <div
      ref="contextMenu"
      class="ctx-menu"
      :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
      v-if="contextMenu.visible"
    >
      <ul>
        <li @click.stop="refreshCurrent" v-if="isRefresh">刷新当前页</li>
        <li @click.stop="closeCurrent">关闭当前页面</li>
        <li @click.stop="closeLeftAll" v-if="isLeftItems">关闭左侧页面</li>
        <li @click.stop="closeRightAll" v-if="isRightItems">关闭右侧页面</li>
        <li @click.stop="closeAll" v-if="items.length > 1">关闭所有</li>
      </ul>
    </div>
  </div>
</template>
<style scoped lang="scss">
.page-tag {
  display: flex;
  position: relative;
}
.page-tag,
.page-tag * {
  box-sizing: border-box;
  transition: none;
}
.page-tag-item {
  height: 28px;
  border: 1px solid #eee;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 10px;
  border-left: none;
  font-size: 12px;
  position: relative;
  padding-right: 26px;
  line-height: 26px;
  cursor: pointer;
  color: #666;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  background-color: #fafafa;
  &:first-child {
    border-left: 1px solid #eee;
  }
  &:hover {
    color: #444;
    background-color: #fafafa;
  }
  &.active {
    color: $primary;
    border-bottom-color: transparent;
    border-top: 2px solid $primary;
    background-color: #fff;
    overflow: visible;
    line-height: 25px;
    .page-tag-btn-remove {
      height: 25px;
      line-height: 25px;
    }
  }
}
.iconfont.icon-delete {
  margin-left: 2px;
  font-size: 12px;
}
.page-tag-btn-remove {
  width: 26px;
  height: 26px;
  text-align: center;
  line-height: 26px;
  position: absolute;
  top: 0;
  right: 0;
  color: #999;
  background-color: inherit;
  &:hover {
    color: #333;
  }
}
.ctx-menu {
  display: block;
  line-height: 32px;
  background-color: #fff;
  border: 1px solid #ccc;
  position: absolute;
  z-index: 9999;
  font-size: 13px;
  color: #666;
  box-shadow: 2px 2px 4px #ddd;
  ul {
    margin: 0;
    padding: 0;
  }
  li {
    list-style: none;
    padding: 0 30px 0 20px;
    cursor: pointer;

    &:hover {
      background-color: #f5f5f5;
      color: #333;
    }
  }
}
</style>

<script>
import { mapGetters } from 'vuex'
import { getMousePosition } from '@/utils'
export default {
  name: 'page-tag',
  props: {
    limit: {
      type: Number,
      default: () => 100
    },
    /** 排除的页面的path列表 */
    exclude: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      contextMenu: {
        visible: false,
        index: 0,
        tag: {},
        x: 0,
        y: 0
      }
    }
  },
  computed: {
    ...mapGetters(['pageTag']),
    items () {
      return this.pageTag.items.filter(
        ele => !!ele.tagable && !this.exclude.some(path => path === ele.path)
      )
    },
    isLeftItems () {
      return this.contextMenu.index > 0
    },
    isRightItems () {
      return this.contextMenu.index < this.items.length - 1
    },
    isRefresh () {
      const item = this.contextMenu.tag
      return item && item.active
    }
  },
  created () {
    // const router = this.$router

    // let items = []
    // {
    //   // 缓存
    //   const storeData = sessionStorage.getItem('pageTag')
    //   if (storeData) {
    //     try {
    //       const parseData = JSON.parse(storeData)
    //       if (parseData instanceof Array) {
    //         items = parseData.map(ele => {
    //           if (ele && typeof ele === 'object') {
    //             const routeConf = this.pageTag.matchRouteConfig(
    //               ele.path,
    //               this.$router
    //             )
    //             ele.component = routeConf ? routeConf.component : {}
    //           }
    //           return ele
    //         })
    //         this.pageTag.items = items
    //       }
    //     } catch (err) {}
    //   }
    //   if (
    //     window &&
    //     typeof window === 'object' &&
    //     typeof window.addEventListener === 'function'
    //   ) {
    //     window.addEventListener('beforeunload', () => {
    //       sessionStorage.setItem('pageTag', JSON.stringify(this.pageTag.items))
    //     })
    //   }
    // }
    // this.pageTag.init(router)
    // console.log(items)
    // if (!items.length) {
    //   this.pageTag.addItem(this.$route)
    // }

    document.addEventListener(
      'click',
      () => {
        this.contextMenu.visible = false
      },
      true
    )
    document.addEventListener('contextmenu', () => {
      // this.contextMenu.visible = false
    })
  },
  watch: {},
  methods: {
    handleContextMenu (ev, index, tag) {
      const pos = getMousePosition(ev)
      this.renderContextMenu(pos.left, pos.top, index, tag)
      ev.preventDefault()
      ev.stopPropagation()
      return false
    },
    renderContextMenu (x, y, index, tag) {
      this.contextMenu.index = index
      this.contextMenu.tag = tag
      this.contextMenu.x = x
      this.contextMenu.y = y
      this.contextMenu.visible = true
      this.$nextTick(() => {
        if (this.$refs.contextMenu) {
          document.body.append(this.$refs.contextMenu)
        }
      })
    },
    closeCurrent (ev) {
      this.removeTag(this.contextMenu.tag)
      this.contextMenu.visible = false
    },
    removeTag (tag) {
      this.pageTag.removeItem(tag)
      if (tag.active) {
        const items = this.items
        // this.pageTag.activate(items[items.length - 1])
        this.$router.replace({ path: items[items.length - 1].fullPath })
      }
    },
    closeAll () {
      this.pageTag.items = []
      this.$router.replace({ name: 'home' })
      this.contextMenu.visible = false
    },
    closeTags (removeItems) {
      this.pageTag.items = this.pageTag.items.filter(ele => !removeItems.some(tag => tag.fullPath === ele.fullPath))
      if (removeItems.some(ele => ele.active)) {
        this.$router.replace({ path: this.contextMenu.tag.fullPath })
      }
    },
    closeLeftAll () {
      const removeItems = this.items.slice(0, this.contextMenu.index)
      this.closeTags(removeItems)
      this.contextMenu.visible = false
    },
    closeRightAll () {
      const removeItems = this.items.slice(this.contextMenu.index + 1)
      this.closeTags(removeItems)
      this.contextMenu.visible = false
    },
    refreshCurrent () {
      this.pageTag.refresh(this.contextMenu.tag)
      this.contextMenu.visible = false
    }
  }
}
</script>
