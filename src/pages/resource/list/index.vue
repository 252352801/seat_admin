<template>
  <pagoda-form-table-layout>
    <!-- 表格上方操作按钮 -->
    <template slot="table-btns">
      <div class="pagoda-button-group">
        <el-button type="info"
                   plain
                   @click="create"
                   v-if="operation('create')">新增</el-button>
        <batch-del-btn :items="selection"
                       itemName="资源"
                       :submitMethod="delMethod"
                       :resultFields="delResultFields"
                       @complete="query"
                       v-if="operation('delete')"></batch-del-btn>
      </div>
    </template>
    <template slot="form"
              slot-scope="scope">
      <el-form inline
               :model="params"
               class="el-form-reset">
        <el-form-item prop="id"
                      label="ID">
          <el-input placeholder="请输入资源ID"
                    v-model="params.id">
          </el-input>
        </el-form-item>
        <el-form-item prop="name"
                      label="名称">
          <el-input placeholder="请输入关键字"
                    v-model="params.name">
          </el-input>
        </el-form-item>
        <el-form-item prop="mark"
                      label="备注">
          <el-input placeholder="请输入关键字"
                    v-model="params.mark">
          </el-input>
        </el-form-item>
        <el-form-item label="来源">
          <el-input v-model="params.source"
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
        <el-table-column type="selection"
                         width="40"
                         v-if="operation('delete')"></el-table-column>
        <el-table-column label="ID"
                         prop="id"
                         width="100"></el-table-column>
        <el-table-column label="名称"
                         prop="name"
                         show-overflow-tooltip
                         width="150"></el-table-column>
        <el-table-column label="备注"
                         prop="mark"
                         show-overflow-tooltip
                         width="150"></el-table-column>
        <el-table-column label="来源"
                         prop="source"
                         show-overflow-tooltip
                         width="150px">
        </el-table-column>
        <el-table-column label="开放时间"
                         show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.begin_time}}-{{scope.row.end_time}}
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         width="150"
                         fixed="right"
                         v-if="anyOperation('detail','modify','bind')">
          <template slot-scope="scope"
                    :data-index="scope.$index">
            <el-button size="mini"
                       type="text"
                       @click="detail(scope.row.id)"
                       v-if="operation('detail')">详情</el-button>
            <el-button size="mini"
                       type="text"
                       @click="modify(scope.row.id)"
                       v-if="operation('modify')">修改</el-button>
            <el-button size="mini"
                       type="text"
                       @click="bind(scope.row.id)"
                       v-if="operation('bind')">座位</el-button>
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
.btn-edit {
  .btn-edit-count {
    text-decoration: underline;
  }
  cursor: pointer;
}
</style>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import batchDelBtn from '@/components/batch-del-btn'
import operation from '@/mixins/operation'
import anyOperation from '@/mixins/any-operation'
export default {
  name: 'resource-list',
  components: {
    batchDelBtn
  },
  mixins: [operation, anyOperation],
  data () {
    return {
      selection: [],
      delResultFields: [
        {
          label: 'ID',
          value: 'id'
        },
        {
          label: '英文名称',
          value: 'name'
        },
        {
          label: '中文名称',
          value: 'mark'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['pageSizes', 'permitCtrl', 'dictionary']),
    ...mapGetters('resourceList', [
      'params',
      'tableData',
      'page',
      'pageSize',
      'count',
      'loading',
      'emptyText'
    ])
  },
  created () {
    this.init()
  },
  destroyed () {
    // this.resetParams()
    // this.resetPage()
  },
  methods: {
    ...mapMutations('resourceList', ['resetPage']),
    ...mapActions('resourceList', [
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
    create () {
      this.$router.push({ name: 'resource-create' })
    },
    modify (id) {
      this.$router.push({ name: 'resource-modify', params: { id } })
    },
    detail (id) {
      this.$router.push({ name: 'resource-detail', params: { id } })
    },
    bind (id) {
      this.$router.push({ name: 'resource-bind', params: { id } })
    },
    delMethod (row) {
      return this.$api.res.del(row.id, {
        name: row['name']
      })
    }
  }
}
</script>
