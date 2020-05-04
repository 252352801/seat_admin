export default {
  methods: {
    resetFieldsValue () {
      if (this.resetFields instanceof Array) {
        if (this.resetFields.every(ele => typeof ele === 'string')) {
          this.resetFields.forEach(field => {
            this.form[field] = ''
          })
        }
      }
    }
  }
}
