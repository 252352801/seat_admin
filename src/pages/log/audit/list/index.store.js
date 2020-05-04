// import http from '@/http/index'
import { storeFactory } from '@/utils/factories/storefactory'
import { isObj, readObj, deleteObjField } from '@/utils'
import api from '@/api'
export default storeFactory('ListStore', {
  state: {
    /** 搜索参数 */
    params: {
      user: '',
      type: '',
      logTable: '',
      startTime: '',
      endTime: '',
      desc: '',
      comments: ''
    }
  },
  mutations: {
  },
  actions: {
    /**
     *查询
     * @param {*} context
     * @param {*} parameter
     */
    query ({ commit, state }, parameter) {
      const params = state.params
      const page = state.page - 1
      const body = deleteObjField(
        {
          user: params.user,
          ops_type: params.type,
          log_table: params.logTable,
          start_time: params.startTime,
          end_time: params.endTime,
          desc: params.desc,
          comments: params.comments,
          limit: state.pageSize,
          offset: page * state.pageSize
        },
        ''
      )
      return api.logAudit.getList(body)
        .then(res => {
          if (isObj(res)) {
            const count = readObj(res, 'count')
            const items = res.items
            commit('setTableData', items)
            commit('setCount', count)
          }
        })
    }
  }
})
