<template>
  <div id="app">
    <b-container>
      <div class="header-bar clearfix mb-1">
        <div class="left" style="float: left">
          Total Order Cost: {{totalAllocatedCost}} / {{totalCost}}
        </div>


        <div class="right" style="float: right">
          <b-button :disabled="updated ? false : true"  :variant="updated ? 'success' : 'light'" size="sm" class="mr-3">
            Save Changes
            <b-icon :variant="updated ? 'light' : 'dark'" icon="arrow-clockwise"></b-icon>
          </b-button>
          <b-button @click="show = !show" variant="secondary" size="sm">
            Add New
            <b-icon variant="light" icon="plus"></b-icon>
          </b-button>
        </div>
      </div>

      <material-order-table
          ref="table"
          :job-items="materialOrderItems"
          :typeList="typeList"
          :totalCost="totalCost"
          :allocationTypeList="allocationTypeList"
          @delete="handleDelete"
          @update-job-item="updateJobItem"
          @set-cost-allocation="setCostAllocation"
          @set-quantity="setQuantity"
          @set-allocated-cost="setAllocatedCost"
          @set-updated="setUpdated"
      >
      </material-order-table>
      <div style="float: right;" class="mt-1">
        <b-button @click="handleSplit" variant="info" size="sm">
          Allocate
          <b-icon class="ml-2" icon="arrow-left-right"></b-icon>
        </b-button>
      </div>


      <modal-entry
          :show="show"
          :typeList="typeList"
          :allocationTypeList="allocationTypeList"
          @update-show="setShow"
          @create-new-material-allocation="createNewMaterialAllocation">
      </modal-entry>


      <b-modal header-class="text-center" body-class="text-center" v-model="confirmationShow">
        <template #modal-header>
          <div class="w-100 font-weight-bold" style="font-size: 1.4rem">
            Are you Sure?
          </div>
        </template>

        <span>Delete This Material Allocation?</span><br>
        {{ deletableItem.jobItem.name }}
        <template #modal-footer>
          <b-button class="mr-auto" variant="secondary" @click="confirmationShow = false">Cancel</b-button>
          <b-button variant="danger" @click="deleteMaterialAllocation(deletableItem)">Delete</b-button>
        </template>
      </b-modal>
    </b-container>
  </div>
</template>

<script>


import MaterialOrderTable from "./components/MaterialOrderTable";
import ModalEntry from "./components/ModalEntry";
import {MaterialOrderItem} from "./Models/MaterialOrderItem";
// import axios from 'axios';

export default {
  name: 'App',
  components: {
    ModalEntry,
    MaterialOrderTable
  },

  watch: {
    jobItems: function () {

    }
  },

  mounted() {
    // axios calls to get all existing job items and
    // set the type and allocation type lists

    this.getMaterialOrderItems()
    // this.setTypeList()
    // this.setAllocationTypeList()



    this.setAllocatedCost()
    this.setPercentAllocation()

    if(this.$refs.table.$refs.item.every(i => i.locked === true)){
      this.$refs.table.locked = true
    }
    else{
      this.$refs.table.locked = false
    }
  },

  updated() {
    // this.setCostAllocation()
    // this.setAllocatedCost()
    if(this.$refs.table.$refs.item.every(i => i.locked === true)){
      this.$refs.table.locked = true
    }
    else{
      this.$refs.table.locked = false
    }
  },

  data() {
    return {
      show: false,
      confirmationShow: false,
      updated: false,
      deletableItem: {
        jobItem: {
          name: null
        }
      },

      materialOrderId: null,
      totalCost: 2000.00,
      allocatedCost: 0.00,
      qtyLines: 4,

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
        'Inventory',
        'Job'
      ],

      materialOrderItems: [
        {
          id: Math.random(),
          type: 'Parts',
          allocationType: 'Inventory',
          jobItem: {
            id: Math.random(),
            name: 'TPS-30961-A_2022-02-15',
            qty: 3,
          },

          qtyFulfilled: null,
          costAllocation: 0,
          qtyLines: 4,
          lastShipmentIn: this.getDate()
        },
        {
          id: Math.random(),
          type: 'Parts',
          allocationType: 'Inventory',
          jobItem: {
            id: Math.random(),
            name: 'TPS-30961-A_2022-02-15',
            qty: 3,
          },

          qtyFulfilled: 5,
          costAllocation: 0,
          qtyLines: 4,
          lastShipmentIn: this.getDate()
        },
        {
          id: Math.random(),
          type: 'Parts',
          allocationType: 'Inventory',
          jobItem: {
            id: Math.random(),
            name: 'TPS-30961-A_2022-02-15',
            qty: 3,
          },

          qtyFulfilled: 1,
          costAllocation: 0,
          qtyLines: 4,
          lastShipmentIn: this.getDate()
        },
        {
          id: Math.random(),
          type: 'Parts',
          allocationType: 'Inventory',
          jobItem: {
            id: Math.random(),
            name: 'TPS-30961-A_2022-02-15',
            qty: 3,
          },

          qtyFulfilled: 3,
          costAllocation: 0,
          qtyLines: 4,
          lastShipmentIn: this.getDate()
        },
        {
          id: Math.random(),
          type: 'Parts',
          allocationType: 'Inventory',
          jobItem: {
            id: Math.random(),
            name: 'TPS-30961-A_2022-02-15',
            qty: 3,
          },

          qtyFulfilled: 6,
          costAllocation: 0,
          qtyLines: 4,
          lastShipmentIn: this.getDate()
        }
      ],
    }
  },


  computed: {
    totalAllocatedCost: function (){
      let total = 0;
      this.materialOrderItems.forEach((item)=>{
        total += item.costAllocation
      })
      if(total === 0 || total.toFixed(2) === this.totalCost.toFixed(2)){
        return total.toFixed(0)
      }
      return total.toFixed(2)
    }
  },

  methods: {
    getMaterialOrderItems: function (){
        // Axios call to get all job items for Material Order
        // axios.get(this.baseURL + 'address/random_address', {
        //   params: {id: this.materialOrderId}
        // }).then((response)=>{
        //   this.materialOrderItems = response
        // })
      let arr = [];
      this.materialOrderItems.forEach((item)=>{
        arr.push(new MaterialOrderItem(
            item.id,
            item.type,
            item.allocationType,
            item.jobItem,
            item.qtyFulfilled,
            item.costAllocation,
            item.qtyLines,
            item.lastShipmentIn,
        ))
      })
      this.materialOrderItems = arr;
    },
    //
    // setTypeList: function (){
    //   axios.get(this.baseURL + '').then((response)=>{
    //     this.typeList = response
    //   })
    // },
    //
    // setAllocationTypeList: function() {
    //   axios.get(this.baseURL + '').then((response)=>{
    //     this.allocationTypeList = response
    //   })
    // },





    setUpdated: function (bool){
      this.updated = bool
    },
    getDate: function (){
      let date = new Date();
      date = date.getFullYear() + '-' + date.getMonth().toLocaleString('en-us', {minimumIntegerDigits: 2}) + '-' + date.getDate().toLocaleString('en-us', {minimumIntegerDigits: 2})
      return date;
    },

    handleSplit: function () {
      this.setUpdated(true)
      this.setAllocatedCost()
      this.setCostAllocation()
      this.setPercentAllocation()
    },

    setPercentAllocation: function (){
      let vm = this;
      this.$refs.table.$refs.item.forEach((item)=>{
          item.percentAllocation = ((vm.materialOrderItems[vm.materialOrderItems.indexOf(item.item)].costAllocation / vm.totalCost) * 100).toFixed(2)
      })
    },

    setAllocatedCost: function () {
      let cost = 0;
      this.materialOrderItems.forEach((item) => {
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
          item.qtyFulfilled = item.jobItem.qty;
          this.updateJobItem(item)
        }
      } else {
        item.qtyFulfilled = parseInt(qty)
        this.updateJobItem(item)
      }
    },

    updateJobItem: function (jobItem) {

      if (this.materialOrderItems.find(j => j.id === jobItem.id) !== jobItem) {
        console.log('updated', jobItem)
        this.$set(this.materialOrderItems, this.materialOrderItems.indexOf(this.materialOrderItems.find(i => i.id === jobItem.id)), jobItem)
      } else {
        return false
      }

    },

    setCostAllocation: function () {
      console.log('setting cost allocation')

      if (this.materialOrderItems) {
        let refArr = [];
        this.materialOrderItems.forEach((jobItem)=>{
          let item = this.$refs.table.$refs.item.find(i => i.id === jobItem.id);

          if(item.locked !== true){
            refArr.push(jobItem)
          }
        })



        refArr.forEach((jobItem)=>{
          let vm = this;
          if(refArr.indexOf(jobItem) === refArr.length-1){
            jobItem.costAllocation = parseFloat(vm.calculateCostAllocation(jobItem));

            if(jobItem.costAllocation !== 0){
              jobItem.costAllocation = Number(jobItem.costAllocation.toString().match(/^\d+(?:\.\d{0,2})?/))

              let remainder = (vm.totalCost - vm.totalAllocatedCost)
              jobItem.costAllocation += remainder;
              jobItem.costAllocation = Number(jobItem.costAllocation.toFixed(2))
              vm.updateJobItem(jobItem)
            }

          }
          else{
            jobItem.costAllocation = parseFloat(vm.calculateCostAllocation(jobItem));
            jobItem.costAllocation = Number(jobItem.costAllocation.toString().match(/^\d+(?:\.\d{0,2})?/))
            vm.updateJobItem(jobItem)
          }
        })

        // this.jobItems.forEach((jobItem) => {
        //   let vm = this;
        //   let item = this.$refs.table.$refs.item.find(i => i.id === jobItem.id)
        //
        //   if (item) {
        //     if (!item.locked) {
        //       if(vm.jobItems.indexOf(jobItem) === vm.jobItems.length-1){
        //         jobItem.costAllocation = parseFloat(vm.calculateCostAllocation(jobItem));
        //         jobItem.costAllocation = Number(jobItem.costAllocation.toString().match(/^\d+(?:\.\d{0,2})?/))
        //
        //         let remainder = (vm.totalCost - vm.totalAllocatedCost)
        //         jobItem.costAllocation += remainder;
        //         jobItem.costAllocation = Number(jobItem.costAllocation.toFixed(2))
        //         vm.updateJobItem(jobItem)
        //       }
        //       else{
        //         jobItem.costAllocation = parseFloat(vm.calculateCostAllocation(jobItem));
        //         jobItem.costAllocation = Number(jobItem.costAllocation.toString().match(/^\d+(?:\.\d{0,2})?/))
        //         vm.updateJobItem(jobItem)
        //       }
        //
        //
        //     }
        //   }
        // })

      }
    },

    calculateCostAllocation: function (jobItem) {
      let total = 0;

      this.materialOrderItems.forEach((item) => {
        if (item.qtyFulfilled && !(this.$refs.table.$refs.item.find(i => i.id === item.id).locked)) {
          total += item.qtyFulfilled
        }
      })
      if(total === 0){
        return 0
      }
      return parseFloat(((this.totalCost - this.allocatedCost) * (jobItem.qtyFulfilled / total)).toPrecision(12));
    },

    setShow: function (show) {
      this.show = show;
    },

    resetDeletableItem: function () {
      this.deletableItem = {
        jobItem: {
          name: null,
        }
      }
    },

    createNewMaterialAllocation: function (arr) {
      console.log(arr)
      arr.data.forEach((item) => {
        this.materialOrderItems.push(new MaterialOrderItem(
            Math.random(),
            arr.type,
            arr.allocationType,
            item,
            0,
            0,
            this.qtyLines,
            this.getDate(),
        ))
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
      this.materialOrderItems.splice(this.materialOrderItems.indexOf(this.materialOrderItems.find(i => i.id === item.id)), 1)
      this.confirmationShow = false
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
