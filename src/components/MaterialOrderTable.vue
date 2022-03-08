<template>
  <table class="table text-left" style="font-size: .6rem; border: 1px solid rgba(0,0,0,.4)">
    <thead>
      <tr id="table-head">
        <th>#</th>
        <th>Type</th>
        <th style="max-width: 3rem">Inventory Type</th>
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
        <th style="max-width: 3rem">Qty Fulfilled</th>
        <th style="max-width: 2rem">$ Allocation</th>
        <th style="max-width: 2rem">% Allocation</th>
        <th style="max-width: 2rem">Qty Lines</th>
        <th style="max-width: 3rem">Last Shipment In</th>
      </tr>

      <material-order-job-item
          v-for="item in jobItems"
          :key="item.id"
          :item="item"
          :index="jobItems.indexOf(item) + 1"
          ref="materialItem"
          @delete="$emit('delete', item)"
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

    }
  },

  props: {
    jobItems: Array,
  },

  computed: {

  },

  methods: {
    percentAllocation: function (item){
      return item.costAllocation;
    },

    setAllJobQty: function (){
      // this.jobItems.forEach((jobItem)=>{
      //   jobItem.qtyFulfilled = jobItem.jobItemQty;
      // })

      this.$refs.materialItem.forEach((i)=>{
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
  padding: 0 .25rem;
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