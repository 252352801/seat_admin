<template>
  <pagoda-detail-layout-v1 :content-title="title"
                           @back="$emit('cancel')">
    <template slot="content-btn">
      <div class="pagoda-button-group"
           v-if="editable">
        <el-button @click="$emit('cancel')">取消</el-button>
        <el-button @click="submit"
                   type="primary"
                   :loading="submitted">保存</el-button>
      </div>
    </template>
    <template slot="content-form">

      <div class="pad">
        <div class="field">
          <label>基本信息</label>
        </div>
        <el-form class="mar-b-sm"
                 ref="form"
                 :model="form"
                 :rules="editable?formRules:null"
                 inline>
          <el-form-item label="区域名称"
                        prop="name">
            <el-input v-model="form.name"
                      placeholder="请输入名称" v-if="editable"></el-input>
                      <span v-if="!editable">{{form.name}}</span>
          </el-form-item>
          <el-form-item label="区域备注"
                        prop="mark">
            <el-input v-model="form.mark"
                      placeholder="请输入备注"
                      v-if="editable"></el-input>
                       <span v-if="!editable">{{form.mark}}</span>
          </el-form-item>
          <el-form-item label="区域来源"
                        prop="source">
            <el-input v-model="form.source"
                      placeholder="请输入来源信息"
                      v-if="editable"></el-input>
                      <span v-if="!editable">{{form.source}}</span>
          </el-form-item>
          <el-form-item label="开放时间"
                        prop="openDuration">
            <!-- <el-date-picker v-model="form.openDuration"
                        type="datetimerange"
                        style="width:556px"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        format="yyyy-MM-dd HH:mm:ss"
                        :default-time="['12:00:00']">
        </el-date-picker> -->
            <el-time-picker is-range
                            v-model="form.openDuration"
                            range-separator="至"
                            style="width:213px"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            value-format="HH:mm:ss"
                            placeholder="选择时间范围"
                            v-if="editable">
            </el-time-picker>
            <span v-if="!editable">
                {{form.openDuration[0]}} - {{form.openDuration[1]}}
            </span>
          </el-form-item>
        </el-form>
        <div class="field"
             v-if="editable">
          <label>布局信息</label>
        </div>
        <el-form inline
                 :hidden="!editable"
                 :model="config"
                 :rules="configRules"
                 ref="configForm">
          <div class="clearfix">
            <el-form-item class="config-item"
                          label="长"
                          prop="w">
              <el-input class="config-input"
                        v-model="config.w"></el-input>
            </el-form-item>
            <el-form-item label="宽"
                          prop="h">
              <el-input class="config-input"
                        v-model="config.h"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="createSeatingCharts ()">预览</el-button>
            </el-form-item>
            <div class="pull-right">
              <el-button @click="clearSelecting"
                         v-if="createable">清空选择</el-button>
            </div>
          </div>
        </el-form>
        <div class="seating-charts clearfix"
             @mousedown="handleSeatingChartsMousedown"
             @mouseup="handleSeatingChartsMouseup"
             @mouseleave="handleSeatingChartsMouseleave">
          <div class="seating-charts-row clearfix"
               v-for="(row,rowIndex) of items"
               :key="rowIndex">
            <div class="square-item"
                 v-bind:class="{'selected':item.selected,pending:item.pending,'focus':item.focus}"
                 v-for="(item,colIndex) of row"
                 :key="colIndex"
                 :style="{width:itemWidthPercent+'%','padding-bottom':itemWidthPercent+'%'}"
                 @mousedown="handleItemMousedown($event,item)"
                 @contextmenu.stop="handleItemContextmenu($event,rowIndex,colIndex)"
                 @mouseenter="handleItemMouseenter($event,item)"
                 @mouseleave="handleItemMouseleave($event,item)"
                 @dblclick="handleItemDbClick(item)"
                 :title="item.seat&&item.seat.name">
              <div class="square-item-body"
                   v-bind:class="{'seat':item.seat&&item.seat.id,'bl':item.bl,'br':item.br,'bt':item.bt,'bb':item.bb}">
                <!-- <span v-if="item.seat&&item.isNamePoint">{{item.seat.name}}</span> -->
              </div>
            </div>
          </div>
          <span class="seating-charts-name"
                v-for="(nameItem,index) of seatNameItems"
                :key="index"
                :style="{left:itemWidthPercent*nameItem.x+'%',top:itemWidthPercent*nameItem.y+'%'}">
            {{nameItem.seat&&nameItem.seat.name}}
          </span>
        </div>
        <div class="pop-menu"
             v-if="isPopMenu"
             :style="popMenuPos">
          <ul>
            <li @click="createSeat"
                v-if="!isFocusingItemSeat">添加座位</li>
            <li v-if="isFocusingItemSeat"
                @click="modifySeat">修改座位</li>
            <li v-if="isFocusingItemSeat"
                @click="showSeatInfo()">座位详情</li>
            <li @click="deleteSeat"
                v-if="editable&&isFocusingItemSeat">移除座位</li>
          </ul>
        </div>
        <seat-form :visible.sync="seatEditor.visible"
                   :mode="seatEditor.mode"
                   :id="seatEditor.seatId"
                   :submitMethod="seatFormSubmitMethod"
                   @cancel="seatEditor.visible=false"
                   @success="handleSeatFormSuccess"
                   @error="handleSeatFormError"></seat-form>
      </div>
    </template>
    <template slot="content">
    </template>
  </pagoda-detail-layout-v1>
</template>
<style lang="scss" scoped>
$border: 1px solid #ddd;
$seatBorder: 1px solid #666;
.seating-charts {
  width: 100%;
  position: relative;
}
.seating-charts-row {
  width: 100%;
}
.square-item {
  display: block;
  float: left;
  background-color: #f0f0f0;
  position: relative;
  box-sizing: border-box;
  &.selected {
    background-color: #e6b536;
    &.pending {
      animation: itemPendding 1s;
      animation-iteration-count: infinite;
    }
  }
  &.focus {
    opacity: 0.75;
  }
  .square-item-body {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    border: $border;
    box-sizing: border-box;
    padding: 5px;
    &.seat {
      background-color: $primary;
      border: none;
      &.bl {
        border-left: $seatBorder;
      }
      &.bt {
        border-top: $seatBorder;
      }
      &.br {
        border-right: $seatBorder;
      }
      &.bb {
        border-bottom: $seatBorder;
      }
    }
  }
}
@keyframes itemPendding {
  0% {
    background-color: $primary;
  }
  50% {
    background-color: #62e2ba;
  }
  100% {
    background-color: $primary;
  }
}
.pop-menu {
  width: 120px;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9999;
  ul {
    box-shadow: 2px 2px 5px #666;
    li {
      line-height: 30px;
      padding: 0 1em;
      background-color: #fff;
      border-bottom: 1px solid $borderColor;
      user-select: none;
      &:hover {
        background-color: #f0f0f0;
      }
      :last-child {
        border-bottom: none;
      }
    }
  }
}
.seating-charts-name {
  position: absolute;
  padding: 5px 8px;
  user-select: none;
}
</style>
<script>
import { getMousePosition, isObj, get } from '@/utils'
import seatForm from './seat-form'
function isMousesLeftKeyClicked (ev) {
  return !ev.altKey && ev.button === 0
}
function isMousesRightKeyClicked (ev) {
  return !ev.altKey && ev.button === 2
}
console.log(isMousesRightKeyClicked)
export default {
  name: 'res-editor',
  components: {
    seatForm
  },
  props: {
    id: {
      type: String | Number,
      default: () => ''
    },
    mode: {
      type: 'create' | 'modify' | 'detail' | 'bind',
      default: () => ''
    },
    /** 提交的方法 需返回一个Promise */
    submitMethod: {
      type: Function,
      default: () => undefined
    }
  },
  data () {
    const numValidator = (rules, value, callback) => {
      const numRegExp = /^\d+$/
      if (!numRegExp.test(value)) {
        callback(new Error('请输入有效数字'))
      } else if (value <= 0) {
        callback(new Error('请输入大于0的数值'))
      } else {
        callback()
      }
    }
    return {
      form: {
        name: '',
        mark: '',
        source: '',
        openDuration: [] // ['08:00:00', '18:30:00']
      },
      formRules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        mark: [{ required: true, message: '请输数入备注', trigger: 'blur' }],
        source: [{ required: true, message: '请输入来源信息', trigger: 'blur' }]
      },
      config: {
        w: 20,
        h: 20
      },
      items: [
        // [
        //   {
        //     selected: false
        //   }
        // ]
      ],
      seats: [],
      configRules: {
        w: [
          { required: true, message: '请输入长度', trigger: 'blur' },
          { validator: numValidator, trigger: 'blur' }
        ],
        h: [
          { required: true, message: '请输入宽度', trigger: 'blur' },
          { validator: numValidator, trigger: 'blur' }
        ]
      },
      focus: false,
      curAction: 'select', // select cancel
      isPopMenu: false,
      popMenuPos: {
        left: 0,
        top: 0
      },
      hidePopMenuFn: null,
      pendingItems: [],
      focusingItem: {
        rowIndex: NaN,
        colIndex: NaN
      },
      seatEditor: {
        mode: 'create',
        id: '',
        form: {
          name: '',
          mark: ''
        },
        visible: false
      }
    }
  },
  computed: {
    title () {
      return {
        create: '新增座位表',
        modify: '修改座位表',
        detail: '座位表详情',
        bind: '座位编辑'
      }[this.mode]
    },
    isFocusingItemSeat () {
      const item = this.getItem(
        this.focusingItem.rowIndex,
        this.focusingItem.colIndex
      )
      return item && item.seat
    },
    seatNameItems () {
      return this.items.flat().filter(item => item.seat && item.isNamePoint)
    },
    itemWidthPercent () {
      return 100 / this.config.w
    },
    createable () {
      return this.mode === 'bind'
    },
    editable () {
      return this.mode === 'create' || this.mode === 'modify'
    }
  },
  async created () {
    if (this.mode !== 'create') {
      const data = await this.$api.res.getDetail(this.id)
      if (isObj(data)) {
        this.initForms(data)
        this.createSeatingCharts()
        const seats = await this.fetchSeats()
        console.log(seats)
        if (Array.isArray(seats)) {
          this.renderSeats(seats)
        }
      }
    }
  },
  mounted () {
    if (document) {
      this.hidePopMenuFn = ev => {
        this.isPopMenu = false
      }
      document.addEventListener('click', this.hidePopMenuFn)
    }
  },
  beforeDestroy () {
    if (document) {
      document.removeEventListener('click', this.hidePopMenuFn)
      this.hidePopMenuFn = null
    }
  },
  methods: {
    initForms (obj) {
      this.form.id = obj.id
      this.form.name = obj.name
      this.form.mark = obj.mark
      this.form.source = obj.source
      this.form.openDuration = []
      this.form.openDuration.push(obj.begin_time || '')
      this.form.openDuration.push(obj.end_time || '')
      console.log(obj)
      console.log(this.form.openDuration)
      if (isObj(obj.layout)) {
        this.config.w = +obj.layout.w || 20
        this.config.h = +obj.layout.h || 20
      }
    },
    async fetchSeats () {
      const res = await this.$api.seat.getList({
        region: this.id
      })
      return get(res, 'items')
    },
    renderSeats (seats) {
      seats.forEach(seat => {
        const seatsItems = seat.layout.items
        seatsItems.forEach(seatItem => {
          const item = this.getItem(seatItem.y, seatItem.x)
          if (item) {
            item.bb = seatItem.bb
            item.bl = seatItem.bl
            item.br = seatItem.br
            item.bt = seatItem.bt
            item.isNamePoint = seatItem.isNamePoint
            item.seat = seat
          }
        })
      })
    },
    async validateConfigForm () {
      if (this.$refs.configForm) {
        const res = await this.$refs.configForm.validate()
        return res
      }
    },
    async createSeatingCharts () {
      const valid = await this.validateConfigForm()
      if (valid) {
        this.genItems(+this.config.w, this.config.h)
      }
    },
    genItems (w, h) {
      const items = []
      for (let i = 0; i < h; i++) {
        const row = []
        for (let j = 0; j < w; j++) {
          row.push({
            selected: false,
            pending: false,
            x: j,
            y: i,
            seat: null,
            bl: false,
            br: false,
            bt: false,
            bb: false,
            focus: false,
            isNamePoint: false
          })
        }
        items.push(row)
      }
      this.items = items
    },
    handleItemMousedown (ev, item) {
      if (this.createable && isMousesLeftKeyClicked(ev)) {
        this.switchSelect(item)
      }
    },
    computePendingItems (rowIndex, colIndex) {
      this.$nextTick(() => {
        this.pendingItems = this.getItemsPendingSiblings(
          this.items,
          rowIndex,
          colIndex
        )
        this.pendingItems.forEach(item => {
          item.pending = true
        })
        console.log(this.pendingItems)
      })
    },
    handleItemContextmenu (ev, rowIndex, colIndex) {
      console.log(ev)
      ev.preventDefault()
      // this.computePendingItems(rowIndex, colIndex)
      this.resetPendingItems()
      const item = this.getItem(rowIndex, colIndex)
      console.log(item)
      if (item && (item.selected || item.seat)) {
        this.focusingItem.rowIndex = rowIndex
        this.focusingItem.colIndex = colIndex
        this.setPopMenuPos(ev)
        this.isPopMenu = true
      }
    },
    getItem (rowIndex, colIndex) {
      const item = this.items[rowIndex] && this.items[rowIndex][colIndex]
      return item
    },
    resetPendingItems () {
      this.pendingItems.forEach(item => {
        item.pending = false
      })
      this.pendingItems = []
    },
    getFocusedItem () {
      return this.getItem(
        this.focusingItem.rowIndex,
        this.focusingItem.colIndex
      )
    },
    createSeat () {
      if (
        !Number.isNaN(this.focusingItem.rowIndex) &&
        !Number.isNaN(this.focusingItem.colIndex)
      ) {
        this.computePendingItems(
          this.focusingItem.rowIndex,
          this.focusingItem.colIndex
        )
        this.seatEditor.mode = 'create'
        this.seatEditor.visible = true
      }
    },
    modifySeat () {
      if (
        !Number.isNaN(this.focusingItem.rowIndex) &&
        !Number.isNaN(this.focusingItem.colIndex)
      ) {
        const item = this.getItem(
          this.focusingItem.rowIndex,
          this.focusingItem.colIndex
        )
        if (item.seat && item.seat.id) {
          this.seatEditor.seatId = item.seat.id
          this.seatEditor.mode = 'modify'
          this.seatEditor.visible = true
        }
      }
    },
    handleItemDbClick (item) {
      if (item.seat && item.seat.id) {
        this.showSeatInfo(item)
      }
    },
    showSeatInfo (item) {
      console.log(this.focusingItem)
      const _item = item || this.getFocusedItem()
      console.log(_item)
      if (_item && _item.seat) {
        this.seatEditor.seatId = _item.seat.id
        this.seatEditor.mode = 'detail'
        this.seatEditor.visible = true
      }
    },
    setPopMenuPos (ev) {
      const pos = getMousePosition(ev)
      this.popMenuPos = {
        left: pos.left + 'px',
        top: pos.top + 'px'
      }
    },
    switchSelect (item) {
      item.selected = !item.selected
      this.curAction = item.selected ? 'select' : 'cancel'
    },
    handleSeatingChartsMousedown (ev) {
      if (isMousesLeftKeyClicked(ev)) {
        this.focus = true
      }
    },
    handleSeatingChartsMouseup (ev) {
      if (isMousesLeftKeyClicked(ev)) {
        this.focus = false
      }
    },
    handleSeatingChartsMouseleave (ev) {
      if (isMousesLeftKeyClicked(ev)) {
        this.focus = false
      }
    },
    handleItemMouseenter (ev, item) {
      if (this.focus && isMousesLeftKeyClicked(ev)) {
        item.selected = this.curAction === 'select'
      } else if (item.seat && item.seat.id) {
        this.focusSeat(item.seat.id, true)
      }
    },
    handleItemMouseleave (ev, item) {
      if (item.seat && item.seat.id && item.focus) {
        this.focusSeat(item.seat.id, false)
      }
    },
    focusSeat (seatId, val) {
      this.items.forEach(row => {
        row.forEach(item => {
          if (item.seat && item.seat.id === seatId) {
            item.focus = val
          }
        })
      })
    },
    getItemsPendingSiblings (items, rowIndex, colIndex) {
      const res = []
      const getSiblings = (table, x, y, collection) => {
        let curItem = this.getItem(x, y)
        if (
          curItem &&
          curItem.selected &&
          !curItem.computting &&
          !curItem.seat
        ) {
          curItem.computting = true // 避免循环查找
          collection.push(curItem)
          // const leftSibling = get(items, `${x}.${y - 1}`)
          getSiblings(table, x, y - 1, collection) // 左
          getSiblings(table, x, y + 1, collection) // 右
          getSiblings(table, x - 1, y, collection) // 上
          getSiblings(table, x + 1, y, collection) // 下
        }
      }
      getSiblings(items, rowIndex, colIndex, res)
      res.forEach(item => {
        delete item.computting
      })
      return res
    },
    drawItemsBorders (items) {
      const drawBorderFn = item => {
        if (item.drawing) return
        item.drawing = true // 避免循环查找
        const handle = (sibling, borderAttr) => {
          const isNext =
            sibling &&
            sibling.selected &&
            items.some(ele => ele.x === sibling.x && ele.y === sibling.y)
          console.log(borderAttr)
          console.log(sibling)
          console.log(sibling && sibling.selected)
          console.log(isNext)
          if (isNext) {
            drawBorderFn(sibling)
          } else {
            item[borderAttr] = true
          }
        }
        const leftSibling = this.getItem(item.y, item.x - 1)
        handle(leftSibling, 'bl')
        const rightSibling = this.getItem(item.y, item.x + 1)
        handle(rightSibling, 'br')
        const topSibling = this.getItem(item.y - 1, item.x)
        handle(topSibling, 'bt')
        const bottomSibling = this.getItem(item.y + 1, item.x)
        handle(bottomSibling, 'bb')
      }
      const firstItem = items[0]
      console.log(firstItem)
      if (firstItem) {
        drawBorderFn(firstItem)
      }
      items.forEach(item => {
        delete item.drawing
      })
    },
    clearSelecting () {
      this.items.forEach(row => {
        row.forEach(item => {
          item.selected = false
        })
      })
    },
    seatFormSubmitMethod (data, mode, id) {
      console.log(mode)
      switch (mode) {
        case 'create':
          this.drawItemsBorders(this.pendingItems)
          this.setSeatsItemsNamePoint(this.pendingItems)
          const body = {
            name: data.name,
            mark: data.mark,
            region: this.form.id,
            layout: JSON.stringify({
              items: this.pendingItems.map(item => {
                return {
                  ...item
                }
              })
            })
          }
          return this.$api.seat.create(body)
        case 'modify':
          const item = this.getItem(
            this.focusingItem.rowIndex,
            this.focusingItem.colIndex
          )
          console.log(item)
          if (item && item.seat) {
            const body = {
              ...item.seat,
              layout: JSON.stringify(item.seat.layout),
              name: data.name,
              mark: data.mark,
              status: data.status
            }
            return this.$api.seat.update(item.seat.id, body)
          }
      }
    },
    handleSeatFormSuccess (data, mode) {
      console.log(data)
      console.log(mode)
      this.seatEditor.visible = false
      if (mode === 'create') {
        this.$message.success(`新增座位：${data.name}`)
        this.pendingItems.forEach(item => {
          item.seat = {
            ...data
          }
        })
        this.drawItemsBorders(this.pendingItems)
        this.pendingItems.forEach(item => {
          item.selected = false
        })
        this.setSeatsItemsNamePoint(this.pendingItems)
        this.resetPendingItems()
      } else {
        const rowIndex = get(this.focusingItem, 'rowIndex')
        const colIndex = get(this.focusingItem, 'colIndex')
        const item = this.getItem(rowIndex, colIndex)
        if (item && item.seat) {
          item.seat.name = data.name
          item.seat.mark = data.mark
        }
        this.$message.success('修改成功！')
      }
    },
    setSeatsItemsNamePoint (items) {
      let minY = null
      items.forEach(item => {
        if (minY === null) {
          minY = item.y
        } else if (item.y < minY) {
          minY = item.y
        }
      })
      const firstRowItems = items.filter(item => item.y === minY)
      let minX = null
      firstRowItems.forEach(item => {
        if (minX === null) {
          minX = item.x
        } else if (item.x < minX) {
          minX = item.x
        }
      })
      const pointItem = items.find(item => item.y === minY && item.x === minX)
      if (pointItem) {
        pointItem.isNamePoint = true
      }
    },
    handleSeatFormError (err, mode) {
      console.log(err)
      console.log(mode)
      if (this.mode === 'create') {
        this.pendingItems.forEach(item => {
          item.bl = false
          item.br = false
          item.bt = false
          item.bb = false
          item.isNamePoint = false
        })
      }
    },
    resetPendingItemsBorder () {
      this.pendingItems.forEach(item => {
        item.bl = false
        item.br = false
        item.bt = false
        item.bb = false
      })
    },
    async deleteSeat () {
      const row = this.focusingItem.rowIndex
      const col = this.focusingItem.colIndex
      const item = this.items[row] && this.items[row][col]
      console.log(item)
      if (item && item.seat && item.seat.id) {
        // 删除
        const res = await this.$api.seat
          .del(item.seat.id, {
            name: item.seat.name
          })
          .catch(err => {
            this.$message.error(err)
            return false
          })
        if (!res) return
        this.$message.success(`已删除座位:${item.seat.name}`)
        const seatId = item.seat.id
        this.items.forEach(row => {
          row.forEach(i => {
            if (i.seat && i.seat.id === seatId) {
              i.seat = null
              i.focus = false
              i.selected = false
              i.isNamePoint = false
              i.bl = false
              i.br = false
              i.bt = false
              i.bb = false
            }
          })
        })
      }
    },
    async validate () {
      const valid = await Promise.all([
        this.$refs.form.validate(),
        this.$refs.configForm.validate()
      ])
      console.log(valid)
      return valid.every(val => !!val)
    },
    getSubmitData () {
      const fd = this.form
      const body = {
        name: fd.name,
        mark: fd.mark,
        // env_desc: fd.desc,
        source: fd.source
      }
      console.log(this.form.openDuration)
      if (this.form.openDuration && this.form.openDuration.length === 2) {
        body['begin_time'] = this.form.openDuration[0]
        body['end_time'] = this.form.openDuration[1]
      }
      body.layout = JSON.stringify({
        w: +this.config.w,
        h: +this.config.h
      })
      if (this.mode === 'modify') {
        body['id'] = fd.id
      }
      return body
    },
    async submit () {
      const valid = await this.validate().catch(() => {})
      console.log(valid)
      if (!valid) {
        console.log(this.$refs.form)
        return
      }
      const body = this.getSubmitData()
      if (typeof this.submitMethod === 'function') {
        this.submitted = true
        const res =
          this.mode === 'create'
            ? this.submitMethod(body, this.mode)
            : this.submitMethod(body.id, body, this.mode)
        if (res && typeof res === 'object' && typeof res.then === 'function') {
          res
            .then(data => {
              this.submitted = false
              this.$emit('success', data, this.mode)
              this.$emit('complete', data, this.mode)
            })
            .catch(err => {
              this.submitted = false
              this.$emit('error', err, this.mode)
              this.$emit('complete', body, this.mode)
            })
        } else {
          this.submitted = false
        }
      } else {
        this.$emit('complete', body, this.mode)
      }
    }
  }
}
</script>
