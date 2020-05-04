import ListStore from './liststore'
import MultipleStore from './multiplestore'
/**
 * store工厂
 * @param {string} className
 * @param {*} store 自定义store配置
 */
export const storeFactory = (className, store = {}, ...args) => {
  let state, getters, mutations, actions
  let instance
  const classMap = {
    ListStore: ListStore,
    MultipleStore: MultipleStore
  }
  const _class = classMap[className]
  if (_class) {
    instance = new _class(store, ...args)
    state = instance.state
    getters = instance.getters
    mutations = instance.mutations
    actions = instance.actions
  }
  return {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
  }
}
