import { generateGetters, generateMutations } from './generate'
import { isObj, clone } from '@/utils'
const stateMap = {

}
console.log(stateMap)
/**
 * 列表页store模版
 * @param {*} store Store配置
 */
export default class MultipleStoreV2 {
  state
  getters
  mutations
  actions
  stateTemplate = {}
  constructor (store) {
    this.state = {
    }
    this.getters = generateGetters(this.state)
    this.mutations = {
      init (state, key) {
        state = this.state
        state[key] = store.state
      },
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

      saveState (state, key) {
        if (!state.cache[key]) {
          state.cache[key] = {}
        }
        for (let o in state) {
          if (o !== 'cache') {
            state.cache[key][o] = clone(state[o])
          }
        }
      },
      removeState (state, key) {
        const data = state.cache[key]
        if (isObj(data)) {
          delete state.cache[key]
        }
      },
      recoverState (state, key) {
        console.log(key)
        console.log(state.cache)
        console.log(state.cache[key])
        const data = state.cache[key]
        if (isObj(data)) {
          for (let o in data) {
            if (o !== 'cache') {
              state[o] = data[o]
            }
          }
        }
      }
    }
    this.actions = {

    }
    if (isObj(store)) {
      // 自定义覆盖
      if (isObj(store.state)) {
        this.state = Object.assign(this.state, store.state)
        this.getters = Object.assign(this.getters, generateGetters(store.state))
        this.mutations = Object.assign(this.mutations, generateMutations(store.state))
      }
      if (isObj(store.getters)) {
        this.getters = Object.assign(this.getters, store.getters)
      }
      if (isObj(store.mutations)) {
        this.mutations = Object.assign(this.mutations, store.mutations)
      }
      if (isObj(store.actions)) {
        this.actions = Object.assign(this.actions, store.actions)
      }
    }
  }
}
