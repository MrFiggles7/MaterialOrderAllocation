<template>
  <table
      class="table text-left m-0"
      style="font-size: .6rem;
      width: 1108px;
      border-collapse: collapse;
      border-spacing: 0;
      position: relative;
      border: 1px solid rgba(0,0,0,.4);"
  >
    <thead>
    <tr id="table-head"
        :style="lockedOrLoaded ? 'background-color: rgba(0,0,0,.1)' : ''">
      <th class="text-center" style="width: 4rem"
          v-b-tooltip.hover
          :title="!loading ? 'Material Order ID #' : ''">ID #</th>
      <th class="text-center" style="width: 5.5rem;">Allocation Type</th>
      <th class="text-center" style="width: 5.5rem;">Material Type</th>
      <th class="text-center" style="width: 4rem">Qty Lines</th>
      <th class="text-center" style="width: 9rem">Job Item</th>
      <th style="width: 6rem;" class="text-center">Last Shipment In</th>
      <th class="text-center" style="border-right: none; width: 5rem">
        <b-row class="m-0">
          <b-col cols="12" lg="6" class="p-0 w-100">
            <div v-b-tooltip.hover
                 :title="!loading ? 'Job Item Qty' : ''"
                 class="align-self-center  pr-2"
                 style="display: inline-block; vertical-align: sub;">
              JI Qty
            </div>
          </b-col>
          <b-col class="p-0">
            <b-button
                :disabled="lockedOrLoaded ? true : false"
                class="table-button w-100"
                size="sm"
                variant="outline-dark"
                @click="setAllJobQty"
            >
              <b-icon scale=".75" icon="chevron-double-right"></b-icon>
            </b-button>
          </b-col>
        </b-row>
      </th>
      <th style="width: 4rem">
        <b-row class="m-0">
          <b-col cols="11" lg="11" class="p-0 text-center align-self-center">
            Qty Fulfilled
          </b-col>
          <!--          <b-col class="p-0">-->
          <!--            <b-button @click="setAllLocked" class="table-button w-75" size="sm" variant="outline-dark">-->
          <!--              <b-icon scale=".75" :icon="locked ? 'lock-fill' : 'unlock-fill'"></b-icon>-->
          <!--            </b-button>-->
          <!--          </b-col>-->
        </b-row>


      </th>
      <th
          style="width: 6rem"
          class="text-center">
        Cost Allocation: $
      </th>
      <th
          v-b-tooltip.hover.left
          :title="!loading ? 'Cost Allocation: %' : ''"
          style="width: 4rem"
          class="text-center">% Allocationr
      </th>
      <!--      <th class="text-right">Qty Lines</th>-->
      <!--      <th style="border-right: none">Last Shipment In</th>-->
      <th class="text-center" style="width: 4rem">
        <b-button :disabled="loading" @click="setAllLocked" class="table-button w-100" size="sm" variant="outline-dark">
          <b-icon scale=".75" :icon="locked ? 'lock-fill' : 'unlock-fill'"></b-icon>
        </b-button>
      </th>
      <th class="text-center" style="width: 2rem">Del</th>
    </tr>


    </thead>
    <tbody>
    <material-order-job-item
        v-for="item in jobItems"
        :key="item.jobItem.id"
        :item="item"
        :index="item.id"
        :typeList="typeList"
        :allocationTypeList="allocationTypeList"
        :shipmentList="shipmentList"
        :totalCost="totalCost"
        :loading="loading"
        ref="item"
        @delete="$emit('delete', item)"
        @update-job-item="updateJobItem"
        @set-allocated-cost="$emit('set-allocated-cost')"
        @set-quantity="setQtyFulfilled"
        @set-updated="setUpdated"
    >
    </material-order-job-item>
    <!--    <tr class="table-body">-->
    <!--      <td colspan="4" style="border-right: none"></td>-->
    <!--      <td class="text-right pr-1" style="border-right: none">Allocated:</td>-->
    <!--      <td class="pl-2" style="border-right: none">{{totalQtyFulfilled}}</td>-->
    <!--      <td class="pl-1" style="border-right: none">$ {{totalAllocatedCost}}</td>-->
    <!--      <td class="pl-2" style="border-right: none"></td>-->
    <!--      <td colspan="3"></td>-->
    <!--    </tr>-->
    </tbody>
      <b-icon
          v-if="loading"
          style="
                  position: absolute;
                  top: 50%; left: 50%;
                  transform: translate(-50%, -50%)"
          icon="arrow-counterclockwise"
          animation="spin-reverse"
          font-scale="6"></b-icon>
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
    shipmentList: Array,
    totalCost: Number,
    loading: Boolean,
  },

  computed: {

    lockedOrLoaded: function (){
      if(this.locked || this.loading){
        return true
      }
      else{
        return false
      }
    },

    totalQtyFulfilled: function () {
      let total = 0;
      this.jobItems.forEach((item) => {
        total += item.qtyFulfilled
      })
      return total;
    },

    totalAllocatedCost: function () {
      let total = 0;
      this.jobItems.forEach((item) => {
        total += item.costAllocation
      })
      return total
    },

  },


  methods: {

    setUpdated: function (bool) {
      this.$emit('set-updated', bool)
    },

    setAllLocked: function () {
      this.locked = !this.locked
      this.$refs.item.forEach((item) => {
        item.locked = this.locked
      })
    },

    setQtyFulfilled: function (item, qty) {
      this.$emit('set-quantity', item, qty)
    },
    setCostAllocation: function (jobItem) {
      this.$emit('set-cost-allocation', jobItem)
    },

    updateJobItem: function (jobItemRef) {
      this.$emit('update-job-item', jobItemRef)
    },

    costAllocationMethod: function (item) {
      let total = 0;
      this.jobItems.forEach((item) => {
        if (item.qtyFulfilled) {
          total += item.qtyFulfilled
        }
      })
      return parseFloat((this.totalCost * (item.qtyFulfilled / total)).toFixed(2));
    },

    setAllJobQty: function () {
      // this.jobItems.forEach((jobItem)=>{
      //   jobItem.qtyFulfilled = jobItem.jobItemQty;
      // })

      this.$refs.item.forEach((i) => {
        i.setQtyFulfilled()
      })
    }
  }
}
</script>

<style scoped>
.table td, .table th {
  word-break: break-word;
  vertical-align: inherit;
  padding: .25rem .25rem;
  border-right: 1px solid rgba(0, 0, 0, .2);
}

.table thead th {
  vertical-align: middle;
}

.table-button {
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
  border: 1px solid rgba(0, 0, 0, .4);
  border-radius: inherit;
  transition: none;
}

.form-control:focus {
  border: 2px solid black;
  box-shadow: none;
}


</style>