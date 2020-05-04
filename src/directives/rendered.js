export default {
  // 指令的定义
  inserted: function (el, binding) {
    if (typeof binding.value === 'function') {
      setTimeout(() => {
        binding.value(el.getBoundingClientRect())
      })
    }
  }
}
