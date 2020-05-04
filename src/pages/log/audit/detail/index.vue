<template>
  <simple-detail :config="config"
                 :api="api"
                 :query="query"
                 title="日志详情">
    <template slot="ctime"
              slot-scope="scope">
      {{scope.row|datetime}}
    </template>
    <template slot="mtime"
              slot-scope="scope">
      {{scope.row|datetime}}
    </template>
    <template slot="log_detail_info"
              slot-scope="scope">
      <json-forma :value="scope.row"></json-forma>
    </template>
  </simple-detail>
</template>

<script>
import simpleDetail from '@/components/simple-detail'
import { datetime } from '@/filters/datetime'
import { get } from 'lodash'
import jsonForma from '@/components/json-format'
export default {
  name: 'log-audit-detail',
  components: {
    simpleDetail,
    jsonForma
  },
  filters: {
    datetime
  },
  data () {
    const isSlot = true
    return {
      id: '',
      config: {
        user_info: {
          label: '操作用户',
          value: data => get(data, 'user_info.name'),
          desc: data => get(data, 'user_info.oaid')
        },
        ops_type_info: {
          label: '操作类型',
          value: data => get(data, 'ops_type_info.ops_type')
        },
        log_table_info: {
          label: '表对象',
          desc: data => get(data, 'log_table'),
          value: data => get(data, 'log_table_info.name')
        },
        data_id: {
          label: '表记录ID'
        },
        comments: {
          label: '备注'
        },
        ctime: {
          label: '创建时间',
          isSlot
        },
        mtime: {
          label: '更新时间',
          isSlot
        },
        log_detail_info: {
          label: '日志内容',
          isSlot
        }
      },
      api: this.$api.logAudit.getDetail,
      query: null
    }
  },
  computed: {},
  created () {
    this.init()
  },
  watch: {
    $route (to, from) {
      if (to.path !== from.path) {
        this.init()
      }
    }
  },
  methods: {
    init () {
      this.id = +this.$route.params.id
      this.query = this.id
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
