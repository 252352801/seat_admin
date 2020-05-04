import { generateGetters, generateMutations } from './generate'
import { clone, isAxiosRequestTimeout, isPromise } from '@/utils'
/**
 * 列表页store模版
 */
export default class ListStore {
  state
  getters
  mutations
  actions
  constructor (store) {
    this.state = {
      /** 表格数据 */
      tableData: [],
      /** 当前页 */
      page: 1,
      /** 每页大小 */
      pageSize: 20,
      /** 是否在加载 */
      loading: false,
      /** 数据条数 */
      count: 0,
      /** 搜索参数 */
      params: {},
      isTimeout: false
    }
    this.getters = {
      ...generateGetters(this.state),
      emptyText (state) {
        if (state.loading) {
          return '加载中...'
        } else {
          return state.isTimeout ? '请求超时，请重试' : '无数据'
        }
      }
    }
    this.mutations = {
      ...generateMutations(this.state),
      /**
       * 设置state中某个属性的值
       * @param {object} state
       * @param {object} payload
       * @param {string} payload.key 属性key
       * @param {*} payload.value 属性值
       */
      set (state, { key, value }) {
        state[key] = value
      },
      /**
       * 重置页面
       * @param {object} state
       */
      resetPage (state) {
        state.tableData = []
        state.page = 1
        state.loading = false
        state.count = 0
      },
      /**
       * 单独设置params的某个字段值
       * @param {object} state
       * @param {object} payload
       * @param {object} payload.field 字段名
       * @param {object} payload.value 字段值
       */
      setParamsField (state, { field, value }) {
        state.params[field] = value
      }
    }
    this.actions = {
      /**
       * 是否表单通过验证
       */
      isFormValid () {
        return true
      },
      /**
       * 初始化
       * @param {object} context
       * @param {object} context.state
       * @param {function} context.dispatch
       */
      async init ({ state, dispatch }) {
        const formValid = await dispatch('isFormValid')
        if (!formValid) {
          return
        }
        if (state.tableData.length) {
          dispatch('query')
        } else {
          dispatch('search')
        }
      },
      /**
       * 重置搜索条件
       * @param {object} context
       * @param {function} context.commit
       */
      resetParams ({ commit }) {
        commit('resetParams')
      },
      /**
       * 搜索
       * @param {object} context
       * @param {function} context.commit
       * @param {function} context.dispatch
       */
      search ({ commit, dispatch }) {
        commit('resetPage')
        dispatch('query')
      },
      /**
       * 查询
       * @param {object} context
       * @param {object} params
       */
      query (context, params) {},
      /**
       * 页码改变时
       * @param {object} context
       * @param {number} page 当前页
       */
      onPageChange (context, page) {
        context.commit('set', {
          key: 'page',
          value: page
        })
        context.dispatch('query')
      },
      /**
       * 每页大小改变时
       * @param {object} context
       * @param {number} pageSize 每页大小
       */
      onPageSizeChange (context, pageSize) {
        context.commit('set', {
          key: 'pageSize',
          value: pageSize
        })
        context.dispatch('search')
      },
      /**
       * 删除后的处理
       * @param {object} context
       * @param {object} context.state
       * @param {function} context.commit
       */
      fixAfterDelRow ({ state, commit }) {
        const { tableData, page, count } = state
        if (tableData.length === 1 && page !== 1) {
          // 处理边界情况，删除当前页最后一条数据时，若当前页不是第一页，则当前页减一
          commit('setPage', page - 1)
          commit('setCount', count - 1)
        }
      }
    }
    if (store && typeof store === 'object') {
      // 自定义覆盖
      if (store.state && typeof store.state === 'object') {
        this.state = Object.assign(this.state, store.state)
        this.getters = Object.assign(this.getters, generateGetters(store.state))
        this.mutations = Object.assign(
          this.mutations,
          generateMutations(store.state)
        )
      }
      if (store.getters && typeof store.getters === 'object') {
        this.getters = Object.assign(this.getters, store.getters)
      }
      if (store.mutations && typeof store.mutations === 'object') {
        this.mutations = Object.assign(this.mutations, store.mutations)
      }
      if (store.actions && typeof store.actions === 'object') {
        this.actions = Object.assign(this.actions, store.actions)
      }
    }
    this.mutations = Object.assign(this.mutations, {
      setParams (state, data) {
        if (data && typeof data === 'object') {
          for (const o in data) {
            if (o in state.params) {
              state.params[o] = data[o]
            }
          }
        }
      }
    })
    if (typeof this.mutations.resetParams !== 'function') {
      this.mutations = Object.assign(this.mutations, {
        /**
         * 重置搜索条件
         */
        resetParams: (() => {
          const orgParams = clone(this.state.params)
          return state => {
            state.params = clone(orgParams)
          }
        })()
      })
    }
    if (typeof this.actions.query === 'function') {
      const query = this.actions.query
      this.actions.query = async function (context, params) {
        context.commit('setIsTimeout', false)
        context.commit('setLoading', true)
        const request = query.apply(this, [context, params])
        if (isPromise(request)) {
          // 当返回是一个Promise时,使用请求耗时作为loading状态持续时间
          request.then(data => {
            context.commit('setLoading', false)
            return data
          }, err => {
            context.commit('setLoading', false)
            // 处理请求超时的情况
            // 当query方法中使用了axios发起请求时，捕获请求超时错误
            const isTimeout = isAxiosRequestTimeout(err)
            context.commit('setIsTimeout', isTimeout)
            return Promise.reject(err)
          })
        } else {
          // 当返回为非Promise时,使用默认oading状态持续时间：1000ms
          const lodingTime = 1000
          setTimeout(() => {
            context.commit('setLoading', false)
          }, lodingTime)
        }
        return request
      }
    }
  }
}
