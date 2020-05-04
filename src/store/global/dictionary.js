import { clone } from '@/utils'
/** ===================================
                字典管理
 ==================================== */
/**
 * 存储字典值和监听函数的对象
 */
const model = {
  /* '字典1': { //字典1表示字典名称
    value: [], //字典表
    handlers: [] //监听处理函数列表
  } */
}
/**
 *创建字典模型
 * @param {string} dictionaryName
 */
const createModel = (dictionaryName) => {
  model[dictionaryName] = {}
  model[dictionaryName].handlers = []
}
/** 加载过的字典 */
let loadedDictionaries = []
/**
 * 是否加载过
 * @param {string} dictionaryName
 */
const isLoaded = (dictionaryName) => {
  return loadedDictionaries.indexOf(dictionaryName) >= 0
}
/**
 * 设置加载状态
 * @param {string} dictionaryName
 */
const setLoaded = (dictionaryName) => {
  loadedDictionaries = loadedDictionaries.filter(ele => ele !== dictionaryName)
  loadedDictionaries.push(dictionaryName)
}
/**
 * 设置字典值同时触发更新
 * @param {string} dictionaryName
 * @param {JSON} data
 */
const setDictionary = (dictionaryName, data) => {
  if (!model[dictionaryName]) {
    createModel(dictionaryName)
  }
  model[dictionaryName].values = data
  if (!(model[dictionaryName].handlers instanceof Array)) {
    return
  }
  for (const handler of model[dictionaryName].handlers) {
    if (typeof handler === 'function') {
      handler(data)
    }
  }
}
/**
 * 获取对应的字典表
 * @param {string} dictionaryName
 */
const getDictionary = (dictionaryName, dataType = 0) => {
  const data = model[dictionaryName] && model[dictionaryName].values
  return clone(data)
}
/**
 * 监听字典（更新）
 * @param {*} dictionaryName
 * @param {function} handler 字典更新后执行的函数 参数为对应字典表
 */
const onUpdate = (dictionaryName, handler) => {
  if (!model[dictionaryName]) {
    createModel(dictionaryName)
  }
  if (!(model[dictionaryName].handlers instanceof Array)) {
    model[dictionaryName].handlers = []
  }
  model[dictionaryName].handlers.push(handler)
}
export default {
  isLoaded: isLoaded,
  setLoaded: setLoaded,
  get: getDictionary,
  set: setDictionary,
  onUpdate: onUpdate
}
