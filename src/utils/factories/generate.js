/**
 * 根据state生成getters
 * @param {*} state
 */
export function generateGetters (state) {
  const getters = {}
  for (const k in state) {
    getters[k] = state => {
      return state[k]
    }
  }
  return getters
}
/**
 * 根据state生成set mutations
 * 生成的mutation为set+state.key,以小驼峰命名 如state.data 生成 setData
 * @param {*} state
 */
export function generateMutations (state) {
  const mutations = {}
  for (const k in state) {
    const field = k[0].toUpperCase() + k.substring(1)
    mutations[`set${field}`] = (state, payload) => {
      state[k] = payload
    }
  }
  return mutations
}
