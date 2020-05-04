export default {
  methods: {
    /**
     * component数据重置
     */
    resetForm () {
      const formData = this.$options.data().form
      if (formData && typeof formData === 'object') {
        Object.entries(formData).forEach(ele => {
          const field = ele[0]
          const value = ele[1]
          this.$set(this.form, field, value)
        })
      }
    }
  }
}
