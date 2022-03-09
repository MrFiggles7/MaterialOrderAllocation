<template>
  <tr class="table-body" :style="locked ? 'background-color: rgba(255,0,0,.1)' : ''">
    <td>{{ index }}</td>
    <td
        style="max-width: 3rem"
    >
      <b-select
          :options="allocationTypeList"
          v-model="allocationType"
      >
      </b-select>
    </td>
    <td
      style="max-width: 4rem"
    >
      <b-select
        :options="typeList"
        v-model="type"
      >
      </b-select>
    </td>
    <td
        style="max-width: 5rem"

    >
      {{ jobItem }}
    </td>
    <td style="max-width: 2rem; min-width: 2rem">
      <div style="display: inline-block; vertical-align: sub;">
        {{ jobItemQty }}
      </div>
      <b-button
          class="table-button"
          size="sm"
          variant="outline-secondary"
          @click="setQtyFulfilled()"
      >
        <b-icon scale=".75" icon="chevron-double-right"></b-icon>
      </b-button>
      <b-icon
          style="float: right; margin-right: .5rem"
          variant="primary"
          v-if="!jobItemQtyMatch"
          icon="info-circle"
          font-scale="2"
      >
      </b-icon>
    </td>
    <td style="max-width: 3rem">
      <b-input
          style="vertical-align: sub"
          type="number"
          class="w-50"
          @blur="setQtyFulfilled(this.qtyFulfilled ? this.qtyFulfilled : 0)"
          v-model="qtyFulfilled"
      >
      </b-input>
      <b-button @click="locked = !locked" class="table-button" size="sm" variant="outline-secondary">
        <b-icon scale=".75" :icon="locked ? 'lock-fill' : 'unlock-fill'"></b-icon>
      </b-button>
    </td>
    <td style="max-width: 3rem">
      <div>
        <span style="vertical-align: text-top">$&nbsp;</span>
        <b-input
            style="vertical-align: text-top"
            type="number"
            class="w-75"
            v-model="costAllocation"
        >
        </b-input>
      </div>

    </td>
    <td style="max-width: 2rem">
        {{percentAllocation ||  0}}&nbsp;%
    </td>
    <td style="max-width: 2rem">
      <b-input
          style="vertical-align: text-top"
          type="number"
          class="w-100"
          v-model="qtyLines"
      >
      </b-input>
    </td>
    <td style="max-width: 3rem">
      {{ lastShipmentIn }}
      <b-button
          class="table-button"
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
      id: null,
      type: null,
      allocationType: null,
      jobItem: null,
      jobItemQty: null,
      qtyFulfilled: 0,
      costAllocation: null,
      qtyLines: null,
      lastShipmentIn: null,
      selectedType: null,
    }
  },

  props: {
    item: {type: Object, twoWay: true},
    index: Number,
    typeList: Array,
    allocationTypeList: Array,
    calculatedCost: Number,
    percentAllocation: Number,
    totalCost: Number,
  },

  computed: {
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

    qtyFulfilled: {

      handler(){

      }

    }
  },

  updated() {
    let objectRef = {
      id: this.id,
      type: this.type,
      allocationType: this.allocationType,
      jobItem: this.jobItem,
      jobItemQty: this.jobItemQty,
      qtyFulfilled: parseInt(this.qtyFulfilled),
      costAllocation: parseInt(this.costAllocation),
      qtyLines: parseInt(this.qtyLines),
      lastShipmentIn: this.lastShipmentIn,
    }

    this.$emit('update-job-item', objectRef)
  },

  methods: {


    resetItemRef: function (){
      for(let key in this.item){
          this[key] = this.item[key]
      }
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
    if(this.item.costAllocation != null){
      this.locked = true;
    }
    this.resetItemRef()
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
  /*border: 1px solid rgba(0,0,0, .4);*/
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
  border: inherit;
  border-radius: inherit;
  box-sizing: inherit;
}
</style>