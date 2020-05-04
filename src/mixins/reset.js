export default {
  methods: {
    /**
     * component数据重置
     */
    resetData () {
      const data = this.$options.data()
      Object.entries(data).forEach(ele => {
        const field = ele[0]
        const value = ele[1]
        this[field] = value
      })
    }
  }
}
