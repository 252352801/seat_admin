<template>
  <div class="content mar-l-sm mar-r-sm" >
    <h1>欢迎来到Pagoda Seat</h1>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'home',
  data () {
    return {}
  },
  computed: {
    ...mapGetters(['user'])
  },
  created () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.field {
  font-size: 16px;
  font-weight: normal;
  padding-left: 10px;
  border-left: 4px solid #6dd17b;
  margin-bottom: 15px;
}
h1{
  text-align: center;
  font-size: 24px;
  color:#666;
  margin-top:100px;
  letter-spacing: 5px;
  font-weight: normal;
}
</style>
