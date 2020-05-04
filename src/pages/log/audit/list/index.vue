<template>
  <pagoda-form-table-layout>
    <!-- 表格上方操作按钮 -->
    <template slot="table-btns">
      <!-- <div class="pagoda-button-group">
      </div> -->
    </template>
    <template slot="form"
              slot-scope="scope">
      <el-form inline
               :model="params"
               class="el-form-reset">
        <el-form-item prop="user"
                      label="用户">
          <user-select v-model="params.user"></user-select>
        </el-form-item>
        <el-form-item prop="type"
                      label="操作类型">
          <el-select v-model="params.type"
                     placeholder="请选择"
                     clearable>
            <el-option v-for="(opt,index) of typeOptions"
                       :key="index"
                       :label="opt.value"
                       :value="opt.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="logTable"
                      label="表对象">
          <el-select v-model="params.logTable"
                     placeholder="请选择"
                     clearable>
            <el-option v-for="(opt,index) of tableObjOptions"
                       :key="index"
                       :label="opt.value"
                       :value="opt.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="起始时间">
          <el-date-picker v-model="params.startTime"
                          align="right"
                          type="datetime"
                          placeholder="起始日期"
                          format="yyyy-MM-dd HH:mm:ss"
                          value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="截止时间">
          <el-date-picker v-model="params.endTime"
                          align="right"
                          type="datetime"
                          placeholder="起始日期"
                          format="yyyy-MM-dd HH:mm:ss"
                          value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="params.comments"
                    placeholder="请输入关键字" />
        </el-form-item>
        <div class="pagoda-button-group mar-b-sm"
             v-bind="scope.btnPosition">
          <el-button @click="search"
                     type="primary"
                     v-if="operation('query')">查询</el-button>
          <el-button @click="resetParams"
                     type="info"
                     plain
                     v-if="operation('query')">重置</el-button>
        </div>
      </el-form>
    </template>
    <template slot="table"
              slot-scope="scope">
      <el-table stripe
                :data="tableData"
                :height="scope.height"
                border
                :empty-text="emptyText"
                v-loading="loading"
                @selection-change="handleSelectionChange">
        <el-table-column label="用户"
                         prop="user_info.name"
                         width="120"></el-table-column>
        <el-table-column label="操作类型"
                         prop="ops_type_info.ops_type"
                         show-overflow-tooltip
                         width="120"></el-table-column>
        <el-table-column label="表对象"
                         prop="log_table_info.name"
                         show-overflow-tooltip
                         width="150"></el-table-column>
        <el-table-column label="创建时间"
                         show-overflow-tooltip
                         width="180">
          <template slot-scope="scope">
            {{scope.row.ctime|datetime}}
          </template>
        </el-table-column>
        <el-table-column label="备注"
                         prop="env_comments"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作"
                         width="80"
                         fixed="right"
                          v-if="anyOperation('detail')">
          <template slot-scope="scope"
                    :data-index="scope.$index">
            <el-button size="mini"
                       type="text"
                       @click="detail(scope.row.id)"
                       v-if="operation('detail')">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <template slot="pagination">
      <el-pagination background
                     :current-page="page"
                     :page-sizes="pageSizes"
                     :page-size="pageSize"
                     :pager-count="9"
                     @current-change="onPageChange"
                     @size-change="onPageSizeChange"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="count"
                     v-if="count">
      </el-pagination>
    </template>
  </pagoda-form-table-layout>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import userSelect from '@/components/select/user-select'
import { datetime } from '@/filters/datetime'
import operation from '@/mixins/operation'
import anyOperation from '@/mixins/any-operation'
export default {
  name: 'log-audit-list',
  components: {
    userSelect
  },
  mixins: [operation, anyOperation],
  filters: {
    datetime
  },
  data () {
    return {
      selection: [],
      typeOptions: [],
      tableObjOptions: []
    }
  },
  computed: {
    ...mapGetters(['pageSizes', 'permitCtrl', 'dictionary']),
    ...mapGetters('logAuditList', [
      'params',
      'tableData',
      'page',
      'pageSize',
      'count',
      'loading',
      'emptyText'
    ])
  },
  async created () {
    this.init()
    this.typeOptions = await this.fetchDictionary('LOG_OPS_TYPE')
    this.tableObjOptions = await this.fetchDictionary('LOG_TABLE_OBJ')
  },
  destroyed () {
    // this.resetParams()
    // this.resetPage()
  },
  methods: {
    ...mapMutations('logAuditList', ['resetPage']),
    ...mapActions(['fetchDictionary']),
    ...mapActions('logAuditList', [
      'init',
      'search',
      'resetParams',
      'query',
      'onPageChange',
      'onPageSizeChange'
    ]),
    handleSelectionChange (selection) {
      this.selection = selection
    },
    detail (id) {
      this.$router.push({ name: 'log-audit-detail', params: { id } })
    }
  }
}
</script>
