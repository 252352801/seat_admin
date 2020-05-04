<template>
  <div class="deletable-item"
       v-bind:class="{'pos-right':buttonPosition==='right','pos-top-right':buttonPosition==='top-right','no-box-styles':!isBoxStyles}">
    <slot></slot>
    <span class="deletable-item-btn"
          @click="handleDelete(index)"
          v-if="deletable"
          :style="btnStyle">
      <i class="iconfont icon-chexiao"></i>
    </span>
  </div>
</template>
<style lang="scss" scoped>
.deletable-item {
  position: relative;
  > .deletable-item-btn {
    display: block;
    width: 20px;
    height: 20px;
    position: absolute;
    color: #fff;
    text-align: center;
    line-height: 20px;
    border-radius: 50%;
    background-color: $danger;
    cursor: pointer;
    i {
      font-size: 14px !important;
    }
  }
  &.pos-right {
    padding-right: 40px;
    > .deletable-item-btn {
      right: 8px;
      top: 50%;
      margin-top: -10px;
    }
  }
  &.pos-top-right {
    &:not(.no-box-styles) {
      padding: 15px;
      border: 1px solid #eee;
    }
    > .deletable-item-btn {
      right: -10px;
      top: -10px;
    }
  }
}
</style>
<script>
export default {
  name: 'deletable-item',
  props: {
    /** 按钮位置 right  top-right */
    buttonPosition: {
      type: String,
      default: 'right'
    },
    deletable: {
      type: Boolean,
      default: true
    },
    /** 是否有盒子样式（border,padding） buttonPosition===‘top-tight’时生效 */
    isBoxStyles: {
      type: Boolean,
      default: true
    },
    btnStyle: {
      type: Object
    }
  },
  methods: {
    handleDelete () {
      this.$emit('delete')
    }
  }
}
</script>
