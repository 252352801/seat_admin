<template>
  <div>详情</div>
</template>

<script>
import { datetime } from '@/filters/datetime'
export default {
  name: 'resource-detail',
  components: {
  },
  filters: {
    datetime
  },
  data () {
    return {
      id: ''
    }
  },
  computed: {},
  created () {
  },
  watch: {
  },
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
