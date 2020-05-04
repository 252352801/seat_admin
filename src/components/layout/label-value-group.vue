<template>
  <div class="label-value-group">
      <slot :labelWidth="labelWidth"></slot>
  </div>
</template>
<style lang="scss" scoped>
</style>
<script>
import { get } from 'lodash'
export default {
  name: 'label-value-group',
  props: {
    labelWidth: {
      type: String | Number,
      default: () => ''
    }
  },
  computed: {
  },
  mounted () {
    if (this.labelWidth !== '' && this.$children instanceof Array) {
      this.$children.forEach(child => {
        const name = child.$options.name
        if (name === 'label-value-item') {
          const labelWidth = get(child.$options, 'propsData.labelWidth')
          if (labelWidth === undefined) {
            child.labelWidth = this.labelWidth
          }
        }
      })
    }
  }
}
</script>
