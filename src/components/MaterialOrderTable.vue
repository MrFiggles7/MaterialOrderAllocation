<template>
  <table
      class="table text-left m-0"
      style="font-size: .6rem;
      border: 1px solid rgba(0,0,0,.4)">
    <thead>
      <tr id="table-head" :style="locked ? 'background-color: rgba(255,0,0,.08)' : ''">
        <th>#</th>
        <th style="max-width: 3rem">Allocation Type</th>
        <th style="max-width: 4rem">Type</th>
        <th style="max-width: 5rem">Job Item</th>
        <th style="max-width: 2rem; min-width: 2rem">
          <div style="display: inline-block; vertical-align: sub;">
            JI Qty
          </div>
          <b-button
              class="table-button"
              size="sm"
              variant="outline-secondary"
              @click="setAllJobQty"
          >
            <b-icon scale=".75" icon="chevron-double-right"></b-icon>
          </b-button>
        </th>
        <th style="max-width: 3rem">
          Qty Fulfilled
          <b-button @click="setAllLocked" class="table-button" size="sm" variant="outline-secondary">
            <b-icon scale=".75" :icon="locked ? 'lock-fill' : 'unlock-fill'"></b-icon>
          </b-button>
        </th>
        <th style="max-width: 2rem">
          $ Allocation
          <b-button
              class="table-button"
              style="border: none"
              size="sm"
              variant="outline-light"
              @click="setCostAllocation"
          >
            <b-icon variant="success" scale=".75" icon="arrow-clockwise"></b-icon>
          </b-button>
        </th>
        <th style="max-width: 2rem">% Allocation</th>
        <th style="max-width: 2rem">Qty Lines</th>
        <th style="max-width: 3rem">Last Shipment In</th>
        <th style="max-width: 1rem"></th>
      </tr>

      <material-order-job-item
          v-for="item in jobItems"
          :key="item.id"
          :item="item"
          :index="jobItems.indexOf(item) + 1"
          :typeList="typeList"
          :allocationTypeList="allocationTypeList"
          :totalCost="totalCost"
          ref="item"
          @delete="$emit('delete', item)"
          @update-job-item="updateJobItem"
          @set-allocated-cost="$emit('set-allocated-cost')"
          @set-quantity="setQtyFulfilled"
          @set-updated="setUpdated"
      >
      </material-order-job-item>

    </thead>
  </table>
</template>

<script>
import MaterialOrderJobItem from "./MaterialOrderJobItem";
export default {
  name: "MaterialOrderTable",
  components: {MaterialOrderJobItem},
  data() {
    return {
      locked: false,
    }
  },

  props: {

    jobItems: Array,
    typeList: Array,
    allocationTypeList: Array,
    totalCost: Number,
  },

  computed: {

  },



  methods: {

    setUpdated: function (bool){
      this.$emit('set-updated', bool)
    },

    setAllLocked: function (){
      this.locked = !this.locked
      this.$refs.item.forEach((item)=>{
        item.locked = this.locked
      })
    },

    setQtyFulfilled: function (item, qty){
      this.$emit('set-quantity', item, qty)
    },
    setCostAllocation: function (jobItem){
      this.$emit('set-cost-allocation', jobItem)
    },

    updateJobItem: function (jobItemRef){
      this.$emit('update-job-item', jobItemRef)
    },

    costAllocationMethod: function (item){
      let total = 0;
      this.jobItems.forEach((item)=> {
        if(item.qtyFulfilled){
          total += item.qtyFulfilled
        }
      })
      return parseFloat((this.totalCost * (item.qtyFulfilled / total)).toFixed(2));
    },

    setAllJobQty: function (){
      // this.jobItems.forEach((jobItem)=>{
      //   jobItem.qtyFulfilled = jobItem.jobItemQty;
      // })

      this.$refs.item.forEach((i)=>{
        i.setQtyFulfilled()
      })
    }
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


</style>