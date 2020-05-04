<template>
  <router-view />
  <!-- <div>
    <div v-for="(tag, index) of items" :key="index">
      <component
        v-for="(tag, index) of items"
        :key="index"
        :hidden="
          pageTag.items.length > 1 &&
            tag.tagable &&
            $route.fullPath !== tag.fullPath
        "
        :is="tag.component"
      >
        <slot></slot>
      </component>
    </div>
  </div> -->
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>

<script>
import { mapGetters } from 'vuex'
import { clone } from '@/utils'
export default {
  name: 'page-tab-view',
  props: {
    rootPath: {
      type: String,
      default: () => ''
    }
  },
  data () {
    return {
      isRouterView: true
    }
  },
  computed: {
    ...mapGetters(['pageTag']),
    items () {
      return clone(this.pageTag.getItemsByParentPath(this.rootPath))
    }
  },
  created () {},
  watch: {},
  methods: {}
}
</script>
