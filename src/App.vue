<template>
  <div id="app">
    <b-container>
      <div class="header-bar clearfix mb-1">
        <div class="left" style="float: left">
          Total Order Cost: {{totalAllocatedCost}} / {{totalCost}}
        </div>


        <div class="right" style="float: right">
          <b-button variant="secondary" size="sm" class="mr-3">
            Save Changes
          </b-button>
          <b-button @click="show = !show" variant="primary" size="sm">
            Add New
          </b-button>
        </div>
      </div>

      <material-order-table
          ref="table"
          :job-items="jobItems"
          :typeList="typeList"
          :totalCost="totalCost"
          :allocationTypeList="allocationTypeList"
          @delete="handleDelete"
          @update-job-item="updateJobItem"
          @set-cost-allocation="setCostAllocation"
          @set-quantity="setQuantity"
          @set-allocated-cost="setAllocatedCost"
      >
      </material-order-table>
      <div style="float: right;" class="mt-1">
        <b-button @click="handleSplit" variant="success" size="sm">
          Split
        </b-button>
      </div>


      <modal-entry
          :show="show"
          :typeList="typeList"
          :allocationTypeList="allocationTypeList"
          @update-show="setShow"
          @create-new-material-allocation="createNewMaterialAllocation">
      </modal-entry>


      <b-modal @cancel="resetDeletableItem" @ok="deleteMaterialAllocation(deletableItem)" v-model="confirmationShow">
        <template #modal-header>
          <div class="w-100">
            Are you Sure?
          </div>
        </template>
        Delete This Material Allocation?<br>
        {{ deletableItem.jobItem }}
      </b-modal>
    </b-container>
  </div>
</template>

<script>


import MaterialOrderTable from "./components/MaterialOrderTable";
import ModalEntry from "./components/ModalEntry";

export default {
  name: 'App',
  components: {
    ModalEntry,
    MaterialOrderTable
  },

  watch: {
    jobItems: function () {
      // this.setTotal()
      // this.setAllocatedCost()
      // this.setCostAllocation()
    }
  },

  mounted() {
    this.setAllocatedCost()

  },

  updated() {
    // this.setCostAllocation()
    // this.setAllocatedCost()
  },

  data() {
    return {
      show: false,
      confirmationShow: false,
      updated: false,
      deletableItem: {
        jobItem: null
      },

      materialOrderId: null,
      totalCost: 2000.00,
      allocatedCost: 0.00,

      typeList: [
        {value: null, text: 'Supplied Material Type'},
        'FABs',
        'Other',
        'Parts',
        'Services',
        'Stencils',
      ],

      allocationTypeList: [
        {value: null, text: 'Allocation Type'},
        'Asset',
        'Supply',
        'Inventory',
        'Job'
      ],

      jobItems: [
        {
          id: Math.random(),
          type: null,
          allocationType: null,
          jobItem: 'TPS-30961-A_2022-02-15',
          jobItemQty: 2,
          qtyFulfilled: 1,
          costAllocation: 400,
          qtyLines: null,
          lastShipmentIn: new Date().toLocaleString('en-us'),
        },
        {
          id: Math.random(),
          type: null,
          allocationType: null,
          jobItem: 'TPS-30961-A_2022-02-15',
          jobItemQty: 2,
          qtyFulfilled: 2,
          costAllocation: null,
          qtyLines: null,
          lastShipmentIn: new Date().toLocaleString('en-us'),
        },
        {
          id: Math.random(),
          type: null,
          allocationType: null,
          jobItem: 'TPS-30961-A_2022-02-15',
          jobItemQty: 2,
          qtyFulfilled: 3,
          costAllocation: null,
          qtyLines: null,
          lastShipmentIn: new Date().toLocaleString('en-us'),
        },
        {
          id: Math.random(),
          type: null,
          allocationType: null,
          jobItem: 'TPS-30961-A_2022-02-15',
          jobItemQty: 2,
          qtyFulfilled: 2,
          costAllocation: null,
          qtyLines: null,
          lastShipmentIn: new Date().toLocaleString('en-us'),
        },
        {
          id: Math.random(),
          type: null,
          allocationType: null,
          jobItem: 'TPS-30961-A_2022-02-15',
          jobItemQty: 2,
          qtyFulfilled: 5,
          costAllocation: null,
          qtyLines: null,
          lastShipmentIn: new Date().toLocaleString('en-us'),
        }
      ],
    }
  },


  computed: {
    totalAllocatedCost: function (){
      let total = 0;
      this.jobItems.forEach((item)=>{
        total += item.costAllocation
      })
      return total
    }
  },

  methods: {
    handleSplit: function () {
      this.setAllocatedCost()
      this.setCostAllocation()
    },

    setAllocatedCost: function () {
      let cost = 0;
      this.jobItems.forEach((item) => {
        if (item.costAllocation) {
          let itemRef = this.$refs.table.$refs.item.find(i => i.id === item.id)
          if (itemRef.locked) {
            cost += item.costAllocation
          }
        }

      })
      this.allocatedCost = cost;
    },

    setQuantity: function (item, qty) {
      if (qty == null) {
        let jobItem = this.$refs.table.$refs.item.find(i => i.id === item.id)
        if (jobItem.locked === false) {
          item.qtyFulfilled = item.jobItemQty;
          this.updateJobItem(item)
        }
      } else {
        item.qtyFulfilled = parseInt(qty)
        this.updateJobItem(item)
      }
    },

    updateJobItem: function (jobItem) {

      if (this.jobItems.find(j => j.id === jobItem.id) !== jobItem) {
        console.log('updated', jobItem)
        this.$set(this.jobItems, this.jobItems.indexOf(this.jobItems.find(i => i.id === jobItem.id)), jobItem)
      } else {
        return false
      }
      // this.jobItems[this.jobItems.indexOf(this.jobItems.find(i => i.id === jobItem.id))] = jobItem
    },

    setCostAllocation: function () {
      console.log('setting cost allocation')

      if (this.jobItems) {
        // for(const jobItem of this.jobItems){
        //   let item = this.$refs.table.$refs.item.find(i => i.id === jobItem.id)
        //
        //   if(item){
        //     if(!item.locked){
        //       jobItem.costAllocation = await this.calculateCostAllocation(item)
        //       console.log('got!')
        //     }
        //   }
        // }


        this.jobItems.forEach((jobItem) => {
          let item = this.$refs.table.$refs.item.find(i => i.id === jobItem.id)

          if (item) {
            if (!item.locked) {
              jobItem.costAllocation = this.calculateCostAllocation(jobItem);
              this.updateJobItem(jobItem)

            }
          }
        })

      }
    },

    calculateCostAllocation: function (jobItem) {
      let total = 0;

      this.jobItems.forEach((item) => {
        if (item.qtyFulfilled && !(this.$refs.table.$refs.item.find(i => i.id === item.id).locked)) {
          total += item.qtyFulfilled
        }
      })
      return parseFloat(((this.totalCost - this.allocatedCost) * (jobItem.qtyFulfilled / total)).toFixed(2));
    },

    setShow: function (show) {
      this.show = show;
    },

    resetDeletableItem: function () {
      this.deletableItem = {
        jobItem: null
      }
    },

    createNewMaterialAllocation: function (arr) {
      console.log(arr)
      arr.data.forEach((item) => {
        this.jobItems.push({
          id: item.id,
          type: arr.type,
          allocationType: arr.allocationType,
          jobItem: item.name,
          jobItemQty: 2,
          qtyFulfilled: null,
          costAllocation: null,
          qtyLines: null,
          lastShipmentIn: new Date().toLocaleString('en-us'),
        })
      })
    },

    handleDelete: function (item) {
      this.deletableItem = item;
      this.getConfirmation();
    },

    getConfirmation: function () {
      this.confirmationShow = true;
    },

    deleteMaterialAllocation: function (item) {
      this.jobItems.splice(this.jobItems.indexOf(this.jobItems.find(i => i.id === item.id)), 1)
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
