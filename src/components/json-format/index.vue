<template>
  <div>
    <json-line :value="jsonLineData"
               :options="options"></json-line>
  </div>
</template>

<script>
import jsonLine from './json-line'
export default {
  name: 'json-format',
  components: {
    'json-line': jsonLine
  },
  props: {
    value: {
      default: () => {
        return ''
      }
    },
    /** 缩进 */
    padding: {
      type: String,
      default: () => '20px'
    },
    /** 是否可折叠 */
    collapseable: {
      type: Boolean,
      default: () => true
    },
    /** 字段颜色 */
    fieldColor: {
      type: String,
      default: () => '#d45e07'
    },
    /** 字符串颜色 */
    stringColor: {
      type: String,
      default: () => '#d45e07' // '#C39163'
    },
    /** 数字颜色 */
    numberColor: {
      type: String,
      default: () => '#00b17a'
    },
    /** 布尔值颜色 */
    booleanColor: {
      type: String,
      default: () => '#569CD6'
    },
    /** 大括号颜色 */
    braceColor: {
      type: String,
      default: () => '#1e54a7'
    },
    /** 方括号颜色 */
    squareBracketColor: {
      type: String,
      default: () => '#1e54a7'
    },
    /** 逗号颜色 */
    commaColor: {
      type: String,
      default: () => '#1e54a7'
    },
    /** 冒号颜色 */
    colonColor: {
      type: String,
      default: () => '#1e54a7'
    }
  },
  data () {
    return {
      jsonLineData: []
    }
  },
  watch: {
    value (val) {
      this.init()
    }
  },
  created () {
    this.init()
  },
  computed: {
    options () {
      return {
        padding: this.padding,
        collapseable: this.collapseable,
        fieldColor: this.fieldColor,
        stringColor: this.stringColor,
        numberColor: this.numberColor,
        booleanColor: this.booleanColor,
        braceColor: this.braceColor,
        squareBracketColor: this.squareBracketColor,
        commaColor: this.commaColor,
        colonColor: this.colonColor
      }
    }
  },
  methods: {
    /** 初始化数据 */
    init () {
      this.jsonLineData = (() => {
        let val = this.value
        if (typeof val === 'string' && val) {
          try {
            val = JSON.parse(val)
          } catch (err) {
            // console.log(err)
          }
        }
        const data = this.format(val)
        data.isLastOne = true
        return data
      })()
    },
    valueType (val) {
      if (val instanceof Array) {
        // 数组
        return 3
      } else if (val && typeof val === 'object') {
        // 对象
        return 2
      } else {
        // 基本类型/null/undefined
        return 1
      }
    },
    /**
     * 格式化
     */
    format (data, key) {
      const newData = {
        type: this.valueType(data),
        value: data,
        isLastOne: false // 是否是最后一个
      }
      if (typeof key === 'string' && key) {
        newData.key = key
      }
      if (data && typeof data === 'object') {
        newData.children = []
        if (data instanceof Array) {
          for (const o of data) {
            newData.children.push(this.format(o))
          }
        } else {
          for (const key in data) {
            newData.children.push(this.format(data[key], key))
          }
        }
        if (newData.children.length > 0) {
          newData.children[newData.children.length - 1].isLastOne = true
        }
      }
      return newData
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
