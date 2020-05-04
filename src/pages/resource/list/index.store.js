// import http from '@/http/index'
import { storeFactory } from '@/utils/factories/storefactory'
import { isObj, readObj, deleteObjField } from '@/utils'
import api from '@/api'
export default storeFactory('ListStore', {
  state: {
    /** 搜索参数 */
    params: {
      id: '',
      name: '',
      mark: '',
      source: ''
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
          id: params.id,
          name: params.name,
          mark: params.mark,
          source: params.source,
          limit: state.pageSize,
          offset: page * state.pageSize
        },
        ''
      )
      return api.res.getList(body)
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
