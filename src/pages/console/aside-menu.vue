<template>
  <div>
    <template v-for="(menuItem,index) of menu">
      <el-submenu :index="menuItem.path"
                  :key="index+''"
                  v-if="menuItem.children&&menuItem.children.length">
        <template slot="title">
          <i :class="menuItem.icon"></i>
          <span>{{menuItem.text}}</span>
        </template>
        <aside-menu :menu="menuItem.children"></aside-menu>
      </el-submenu>
      <el-menu-item v-else
                    :key="index+''"
                    :index="menuItem.path">
        <i :class="menuItem.icon"></i>
        <span slot="title">{{menuItem.text}}</span>
      </el-menu-item>
    </template>
  </div>
</template>

<script>
export default {
  name: 'aside-menu',
  props: {
    menu: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {}
  },
  created () {},
  computed: {},
  methods: {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
