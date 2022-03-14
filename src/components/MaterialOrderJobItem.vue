<template>
  <tr class="table-body" :style="locked ? 'background-color: rgba(255,0,0,.08)' : ''">
    <td :style="updated ? '' : ''">{{ index }}</td>
    <td
        style="min-width: 5rem"
        :style="updated ? '' : ''"
    >
      <b-select
          class="pl-1"
          :disabled="locked ? true : false"
          :options="allocationTypeList"
          v-model="allocationType"
      >
      </b-select>
    </td>
    <td
        :style="updated ? '' : ''"
        style="min-width: 4rem"
    >
      <b-select
          class="pl-1"
        :disabled="locked ? true : false"
        :options="typeList"
        v-model="type"
      >
      </b-select>
    </td>
    <td
        :style="updated ? '' : ''"
        style="max-width: 5rem"
    >
      {{ jobItem }}
    </td>
    <td
        :style="updated ? '' : ''">
      <b-row class="m-0">
        <b-col cols="12" lg="6" class="p-0 w-100">
          <div style="display: inline-block; vertical-align: sub;">
            {{ jobItemQty }}
          </div>
        </b-col>
        <b-col class="p-0">
          <b-button
              :disabled="locked ? true : false"
              class="table-button w-100"
              size="sm"
              variant="outline-secondary"
              @click="setQtyFulfilled()"
          >
            <b-icon scale=".75" icon="chevron-double-right"></b-icon>
          </b-button>
        </b-col>
      </b-row>



    </td>
    <td
        :style="updated ? '' : ''">
      <b-row class="m-0">
        <b-col cols="12" lg="6" class="p-0">
          <b-input
              style="vertical-align: sub;"
              type="number"
              class="text-right pr-1 w-100"
              min="0"
              v-model="qtyFulfilled"
          >
          </b-input>
        </b-col>
        <b-col class="p-0">
          <div>
            <b-icon
                v-b-tooltip.hover
                title="Job Item Qty and Qty fulfilled are not equivalent"
                v-b-hover="iconHover"
                class="ml-lg-2"
                :variant="iconHovered ? 'secondary' : 'primary'"
                v-if="!jobItemQtyMatch"
                icon="info-circle"
                font-scale="2"
            >
            </b-icon>
            <b-button @click="locked = !locked" class="table-button w-50" size="sm" variant="outline-secondary">
              <b-icon scale=".75" :icon="locked ? 'lock-fill' : 'unlock-fill'"></b-icon>
            </b-button>
          </div>
        </b-col>

      </b-row>


    </td>
    <td
        :style="updated ? '' : ''"
        style="max-width: 5rem">
      <b-row class="m-0 p-0">
          <span style="vertical-align: text-top">$&nbsp;</span>
          <b-input
              style="vertical-align: text-top; width: 85%;"
              step=".01"
              type="number"
              class="text-right p-0 pr-1"
              min="0.00"
              ref="costAllocationInput"
              @blur="setCostAllocation"
              :value="costAllocationDecimal"
          >
          </b-input>
      </b-row>




    </td>
    <td
        :style="updated ? '' : ''"
        class="text-right">
        {{percentAllocation ||  0}}&nbsp;%
    </td>
    <td
        :style="updated ? '' : ''"
        style="max-width: 3rem">
      <b-input
          style="vertical-align: text-top; "
          type="number"
          class="w-100 text-right"
          v-model="qtyLines"
      >
      </b-input>
    </td>
    <td
        :style="updated ? '' : ''"
        style="min-width: 6rem">
      <b-select
          class="pl-1"
          :disabled="locked ? true : false"
          :options="shipmentList"
          v-model="lastShipmentIn"
      >
      </b-select>
    </td>
    <td
        :style="updated ? '' : ''"
        style="">
      <b-button
          class="p-0"
          style="border: none"
          size="sm"
          variant="outline-light"
          @click="$emit('delete')"
      >
        <b-icon variant="danger" scale=".75" icon="trash"></b-icon>
      </b-button>
    </td>
  </tr>
</template>

<script>
export default {
  name: "MaterialOrderJobItem",

  data(){
    return{
      locked: false,
      updated:false,

      id: null,
      type: null,
      allocationType: null,
      jobItem: null,
      jobItemQty: null,
      qtyFulfilled: 0,
      costAllocation: 0,
      qtyLines: null,
      lastShipmentIn: null,
      selectedType: null,
      percentAllocation: 0,

      shipmentList: null,

      iconHovered: false,
    }
  },

  props: {
    item: {type: Object, twoWay: true},
    index: Number,
    typeList: Array,
    allocationTypeList: Array,
    calculatedCost: Number,
    totalCost: Number,
  },

  computed: {
    costAllocationDecimal: function (){
      return parseFloat(this.costAllocation).toFixed(2)
    },

    borderBlue: function (){
      return "border-top: 2px solid rgba(0,0,255,.4); border-bottom: 2px solid rgba(0,0,255,.4);"
    },

    borderYellow: function (){
      return "border-top: 2px solid rgba(255,247,0,.4); border-bottom: 2px solid rgba(255,247,0,.4);"
    },

    borderGreen: function (){
      return "border-top: 2px solid rgba(0,128,9,.4); border-bottom: 2px solid rgba(0,128,9,.4);"
    },

    jobItemQtyMatch: function (){
      if(parseFloat(this.jobItemQty) === parseFloat(this.qtyFulfilled)){
        return true
      }
      else{
        return false;
      }
    },
  },

  watch: {
    item: {
      deep: true,

      handler(){
        this.resetItemRef()
        // this.$emit('set-allocated-cost')
        // this.$emit('set-cost-allocation')
      }
    },

    locked: function (){
      this.$emit('set-allocated-cost')
    },

    type: function (){
      if(this.type !== this.item.type){
        this.updated = true;
        this.$emit('set-updated', true)
      }
    },
    allocationType: function (){
      if(this.allocationType !== this.item.allocationType){
        this.updated = true;
        this.$emit('set-updated', true)
      }
    },
    qtyFulfilled: function (){
      if(this.qtyFulfilled !== this.item.qtyFulfilled){
        this.updated = true;
        this.$emit('set-updated', true)
      }
    },
    costAllocation: function (){

      if(parseFloat(this.costAllocation) !== parseFloat(this.item.costAllocation)){
        this.locked = true;
        this.updated = true;
        this.$emit('set-updated', true)
      }
    },
    qtyLines: function (){
      if(this.qtyLines !== this.item.qtyLines){
        this.updated = true;
        this.$emit('set-updated', true)
      }
    },
  },

  updated() {
    let objectRef = {
      id: this.id,
      type: this.type,
      allocationType: this.allocationType,
      jobItem: {
        id: this.item.jobItem.id,
        name: this.jobItem,
        qty: this.jobItemQty
      },
      qtyFulfilled: parseInt(this.qtyFulfilled),
      costAllocation: parseFloat(this.costAllocation),
      qtyLines: parseInt(this.qtyLines),
      lastShipmentIn: this.lastShipmentIn,
    }

    this.$emit('update-job-item', objectRef)
  },

  methods: {


    iconHover: function (isHovered){
      this.iconHovered = isHovered
    },

    setShipmentList: function (){
      this.shipmentList = [
          this.lastShipmentIn,
      ]
    },
    setCostAllocation: function (){
        this.costAllocation = this.$refs.costAllocationInput.$el.value;
    },

    resetItemRef: function (){
      this.id = this.item.id;
      this.type = this.item.type;
      this.allocationType = this.item.allocationType;
      this.jobItem = this.item.jobItem.name;
      this.jobItemQty = this.item.jobItem.qty;
      this.qtyFulfilled = this.item.qtyFulfilled;
      this.costAllocation = this.item.costAllocation;
      this.qtyLines = this.item.qtyLines;
      this.lastShipmentIn = this.item.lastShipmentIn;
    },

    setQtyFulfilled: function (qty){
      if(qty != null){
        this.$emit('set-quantity', this.item, qty)
      }
      else{
        this.$emit('set-quantity', this.item)
      }

    },
  },

  created() {
    if(this.item.costAllocation != null && this.item.costAllocation !== 0){
      this.locked = true;
    }
    this.resetItemRef()
    this.setShipmentList();
  }
}
</script>

<style scoped>
.table td, .table th{
  word-break: break-word;
  vertical-align: inherit;
  padding: .25rem .25rem;
  border-right: 1px solid rgba(0,0,0, .2);
}

.table thead th{
  vertical-align: middle;
}

.table-button{
  padding: 0;
  float: right
}

.table-body:hover{
  background-color: rgba(0,0,0,.1);
}

.form-control {
  display: inline-block;
  width: auto;
  height: auto;
  padding: inherit;
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  color: inherit;
  background-color: inherit;
  border: 1px solid rgba(0,0,0, .4);
  border-radius: inherit;
  transition: none;
}

.form-control:focus {
  border: 2px solid black;
  box-shadow: none;
}

.custom-select {
  width: 100%;
  height: inherit;
  padding: .25rem 0;
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  border: 1px solid rgba(0,0,0,.4);
  border-radius: inherit;
  box-sizing: inherit;
  background-color: inherit;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>