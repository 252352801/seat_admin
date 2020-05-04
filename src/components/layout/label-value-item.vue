<template>
  <div class="label-value-item">
    <label class="label-value-item--label"
           :style="{'min-width':fixLabelWidth}">
      <slot name="label">{{label}}</slot>
    </label>
    <div class="label-value-item--value"
         ref="valueWrap"
         v-bind:class="{'hidden':isNull}">
      <slot>
        {{value}}
      </slot>
    </div>
    <div class="label-value-item--null"
         v-if="isNull">
      <span class="text-disabled">--/--</span>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.label-value-item {
  display: flex;
  margin-bottom: 15px;
  .label-value-item--label {
    display: inline-block;
    min-width: 6em;
    vertical-align: top;
    color: #999;
    padding-right: 15px;
    font-size: 13px;
  }
  .label-value-item--value,
  .label-value-item--null {
    flex: 1;
    display: inline-block;
    vertical-align: top;
    white-space: normal;
    word-break: break-all;
    &.hidden {
      display: block;
      width: 0;
      height: 0;
      flex: 0;
      overflow: hidden;
    }
  }
}
</style>
<script>
export default {
  name: 'label-value-item',
  props: {
    label: {
      type: String,
      default: () => ''
    },
    value: {
      type: String | Number,
      default: () => ''
    },
    labelWidth: {
      type: String | Number,
      default: () => ''
    }
  },
  data () {
    return {
      isNull: false,
      contentObserver: null
    }
  },
  computed: {
    fixLabelWidth () {
      if (typeof this.labelWidth === 'number') {
        return this.labelWidth ? this.labelWidth + 'px' : this.labelWidth
      } else if (this.labelWidth) {
        return this.labelWidth
      }
    }
  },
  beforeCreate () {},
  beforeDestroy () {
    if (this.contentObserver) {
      this.contentObserver.disconnect()
    }
  },
  created () {
    this.observeContent()
  },
  mounted () {
    if (!this.contentObserver) {
      this.observeContent()
    }
  },
  updated () {
  },
  methods: {
    observeContent () {
      if (window && typeof window.MutationObserver === 'function' && this.$refs.valueWrap) {
        console.log(MutationObserver)
        const contentElem = this.$refs.valueWrap
        console.log(contentElem)
        var observer = new MutationObserver((mutationsList) => {
          console.log(mutationsList)
          console.log(contentElem.innerHTML)
          console.log(contentElem.innerText)
          this.isNull = true
        })
        observer.observe(contentElem, { attributes: true, childList: true, subtree: true })
        this.contentObserver = observer
      }
    }
  }
}
</script>
