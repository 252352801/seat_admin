import router from '@/router'
export default {
  // 指令的定义
  inserted: (el, binding) => {
    el.addEventListener('click', () => {
      router.go(-1)
    })
  }
}
