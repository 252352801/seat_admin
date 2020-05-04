<template>
  <span>{{text}}</span>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'dictionary',
  props: {
    name: {
      type: String,
      default: () => {
        return ''
      }
    },
    value: {
      type: String | Number,
      default: () => {
        return ''
      }
    }
  },
  data () {
    return {
      text: ''
    }
  },
  created () {
    this.initText()
  },
  computed: {
  },
  watch: {
    value (val) {
      this.initText()
    }
  },
  methods: {
    ...mapActions(['fetchDictionary']),
    async initText () {
      if (this.value !== '' && this.value !== undefined) {
        const dict = await this.fetchDictionary(this.name)
        if (dict instanceof Array) {
          const target = dict.find(ele => ele.key === this.value)
          if (target) {
            this.text = target.value
          }
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
