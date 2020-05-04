<template>
  <res-editor
    mode="bind"
    :id="$route.params.id"
    @cancel="goBack"
  ></res-editor>
</template>

<script>
import resEditor from '@/components/res-editor'
import goBack from '@/mixins/goback'
export default {
  name: 'res-modify',
  components: {
    resEditor
  },
  mixins: [goBack],
  data () {
    return {}
  },
  computed: {
  },
  created () {},
  methods: {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
