<template>
  <div class="moveable-element"
       @mousedown="handleMouseDown"
       @mouseup.capture="handleMouseUp"
       ref="wrap">
    <slot></slot>
  </div>
</template>
<style lang="scss" scoped>
</style>
<script>
function getStyleValue (data) {
  const val = +data
  return !Number.isNaN(val) ? val + 'px' : data
}
function isMouseKeyLeft (ev) {
  return ev.button === 0
}
// 判断是点击还是移动的延时阀值
const thresholdDelay = 300
export default {
  name: 'moveable-element',
  props: {
    width: {
      type: Number | String
    },
    height: {
      type: Number | String
    }
  },
  data () {
    return {
      moveable: false,
      lastX: NaN,
      lastY: NaN,
      mouseMoveHandler: null,
      moving: false
    }
  },
  computed: {},
  mounted () {
    const elem = this.$refs.wrap
    if (elem) {
      const left = elem.offsetLeft
      const top = elem.offsetTop
      elem.style.right = null
      elem.style.bottom = null
      elem.style.left = left + 'px'
      elem.style.top = top + 'px'
      elem.style.width = getStyleValue(this.width)
      elem.style.height = getStyleValue(this.height)
    }
    this.mouseMoveHandler = ev => {
      if (this.moveable) {
        const ev = event || window.event
        if (!this.isFirstTimeMove()) {
          const moveX = ev.clientX - this.lastX
          const moveY = ev.clientY - this.lastY
          this.moveElem(moveX, moveY)
        }
        this.lastX = ev.clientX
        this.lastY = ev.clientY
      }
    }
    window.addEventListener('mousemove', this.mouseMoveHandler)
    this.initialized = true
  },
  beforeDestroy () {
    window.removeEventListener('mousemove', this.mouseMoveHandler)
  },
  methods: {
    handleMouseDown (ev) {
      console.log(ev)
      if (isMouseKeyLeft(ev)) { // 鼠标左键
        this.mouseupTime = new Date().getTime()
        this.startMove(ev)
      }
    },
    handleMouseUp (ev) {
      if (isMouseKeyLeft(ev)) {
        this.endMove(ev)
      }
    },
    startMove () {
      this.moveable = true
      if (!this.isFirstTimeMove()) {
        this.lastX = NaN
        this.lastY = NaN
      }
    },
    endMove (ev) {
      this.moveable = false
      if (this.moving) {
        setTimeout(() => {
          this.moving = false
        }, thresholdDelay)
        ev.stopPropagation()
      }
    },
    isFirstTimeMove () {
      return Number.isNaN(this.lastX) && Number.isNaN(this.lastY)
    },
    isChild (elem, target) {
      return (
        elem.parentNode === target ||
        (elem.parentNode && this.isChild(elem.parentNode, target))
      )
    },
    move (event) {
      if (this.moveable) {
        const ev = event || window.event
        if (!this.isFirstTimeMove()) {
          const moveX = ev.clientX - this.lastX
          const moveY = ev.clientY - this.lastY
          this.moveElem(moveX, moveY)
        }
        this.lastX = ev.clientX
        this.lastY = ev.clientY
      }
    },
    moveElem (x, y) {
      const elem = this.$refs.wrap
      if (elem) {
        console.log('move')
        this.moving = true
        elem.style.left = elem.offsetLeft + x + 'px'
        elem.style.top = elem.offsetTop + y + 'px'
      }
    },
    handleClick (ev) {
      if (!this.moveable) {
        this.$emit('pureClick', ev)
      }
    }
  }
}
</script>
