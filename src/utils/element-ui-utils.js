export function scrollElementFormIntoView (formObj) {
  if (formObj) {
    const fields = formObj.fields
    const firstErrField = fields.find(ele => ele.validateState === 'error')
    if (firstErrField && firstErrField.$el) {
      firstErrField.$el.scrollIntoView(false)
    }
  }
}
/**
 * 将当前时间节点(触发校验到处理结束)内验证的表单中第一个出错的表单的第一个出错的地方滚动到可视区域
 */
export const insertActionsAfterValidating = (function () {
  let validatedForms = []
  console.log(validatedForms)
  return elemForm => {
    const validateFn = elemForm.methods.validate
    elemForm.methods.validate = function (cb) {
      const callback = cb
      let _this = this
      const action = function () {
        _this.$nextTick(() => {
          const firstErrForm = validatedForms.find(form => form.fields.some(f => f.validateState === 'error'))
          console.log(firstErrForm)
          scrollElementFormIntoView(firstErrForm)
          validatedForms = []
          _this = null
        })
      }
      validatedForms.push(_this)
      if (typeof callback === 'function') {
        cb = function (...args) {
          action()
          callback.call(_this, ...args)
        }
      }
      // const res = Promise.resolve(validateFn.call(_this, cb))
      const res = new Promise((resolve, reject) => {
        this.$nextTick(action)
        resolve(validateFn.call(_this, cb))
      })
      console.log(res)
      return res
    }
  }
})()
