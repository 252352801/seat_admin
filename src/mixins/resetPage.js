export default {
  methods: {
    /**
     * 页面重置
     */
    resetPage () {
      const data = this.$options.data()
      if (data && typeof data === 'object') {
        for (const o in data) {
          this[o] = data[o]
        }
      }
    }
  }
}
