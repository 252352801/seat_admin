<template>
  <div :style="'padding-left:'+options['padding']">
    <!--field-->
    <span v-if="value.key"
          :style="'color:'+options['fieldColor']">"{{value.key}}"</span>
    <!--冒号-->
    <span v-if="value.key"
          :style="'color:'+options['colonColor']">:</span>
    <span v-if="isOpen">
      <!--值-->
      <!--字符串-->
      <span v-if="typeof value.value==='string'"
            :style="'color:'+options['stringColor']">"{{value.value}}"</span>
      <!--数字-->
      <span v-if="typeof value.value==='number'"
            :style="'color:'+options['numberColor']">{{value.value}}</span>
      <!--布尔值-->
      <span v-if="typeof value.value==='boolean'"
            :style="'color:'+options['booleanColor']">{{value.value}}</span>
      <!--其他-->
      <span v-if="value.value===null||value.value===undefined">{{value.value}}</span>
    </span>
    <span class="jl-data-toggle" v-if="options['collapseable']&&value.type!==1&&value.children&&value.children.length>0"
          @click="toggleOpen">{{isOpen?'-':'+'}}</span>
    <span v-if="value.type===2"
          :style="'color:'+options['braceColor']">{</span>
    <span v-if="value.type===3"
          :style="'color:'+options['squareBracketColor']">[</span>
    <ul v-if="isOpen&&value.type!==1&&value.children&&value.children.length>0">
      <li v-for="(child,index) of value.children"
          :key="index">
        <json-line :value="child"
                   :options="options"></json-line>
      </li>
    </ul>
    <span v-if="!isOpen&&value.type!==1&&value.children&&value.children.length>0" style="color:#999">...</span>
    <span v-if="value.type===2"
          :style="'color:'+options['braceColor']">}</span>
    <span v-if="value.type===3"
          :style="'color:'+options['squareBracketColor']">]</span>
    <span v-if="!value.isLastOne">,</span>
  </div>
</template>

<script>
export default {
  name: 'json-line',
  props: {
    value: {
      default: () => {
        return {}
      }
    },
    options: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      isOpen: true
    }
  },
  created () {
  },
  computed: {},
  methods: {
    toggleOpen () {
      this.isOpen = !this.isOpen
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
ul,
li {
  padding: 0;
  margin: 0;
}
li {
  list-style: none;
}
.jl-data-toggle{
    font-size: 12px;
    border: 1px solid #ccc;
    color: #ccc;
    display: inline-block;
    width: 14px;
    height: 14px;
    text-align: center;
    line-height: 12px;
    cursor: pointer;
    user-select: none;
    border-radius: 3px;
    &:hover{
        border-color:#999;
        color:#999;
    }
}
</style>
