<template>
  <div id="app">
    <b-container>
      <div style="width: 1108px;">
        <div class="header-bar clearfix mb-1">
          <div class="left" style="float: left">
            Total Order Cost: <span :style="overUnderAllocated ? 'color: red' : ''">{{ totalAllocatedCost}}</span> /
            {{ totalCost }}
          </div>


          <div class="right" style="float: right">
            <b-button :disabled="updatedAndNoNegatives ? false : true"
                      :variant="updatedAndNoNegatives ? 'success' : 'light'"
                      size="sm"
                      class="mr-3"
                      @click="handleSave"
            >
              Save Changes
              <b-icon :variant="updatedAndNoNegatives ? 'light' : 'dark'" icon="upload"></b-icon>
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
            :shipmentList="shipmentList"
            @delete="handleDelete"
            @update-job-item="updateJobItem"
            @set-cost-allocation="setCostAllocation"
            @set-quantity="setQuantity"
            @set-allocated-cost="setAllocatedCost"
            @set-updated="setUpdated"
        >
        </material-order-table>
        <div style="float: left;" class="mt-1">
          <b-button variant="outline-danger" size="sm">
            Reset Table Data
            <b-icon class="ml-2" icon="arrow-clockwise"></b-icon>
          </b-button>
        </div>


        <div style="float: right;" class="mt-1">
          <b-button class="mr-3" @click="handleDistribute" variant="outline-info" size="sm">
            Distribute Remaining Dollars
            <b-icon class="ml-2" icon="shuffle"></b-icon>
          </b-button>
          <b-button @click="handleSplit" variant="info" size="sm">
            Allocate by Qty Fulfilled
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


        <!--      Delete Item Modal-->
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


        <!--      //Save Changes Modal-->
        <b-modal header-class="text-center" body-class="text-center" v-model="saveConfirmationShow">
          <template #modal-header>
            <div class="w-100 font-weight-bold" style="font-size: 1.4rem">
              Are you Sure?
            </div>
          </template>

          <span>Save These Changes to the Database?</span><br>
          <span v-for="item in materialOrderItems" :key="item.id">
            <span>{{ item.jobItem.name }}</span><br>
          </span>
          <template #modal-footer>
            <b-button class="mr-auto" variant="secondary" @click="saveConfirmationShow = false">Cancel</b-button>
            <b-button variant="success" @click="saveChanges()">Save Changes</b-button>
          </template>
        </b-modal>
      </div>
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

  watch: {},

  mounted() {
    // axios calls to get all existing job items and
    // set the type and allocation type lists
    this.getMaterialOrderItems()
    // this.setTypeList()
    // this.setAllocationTypeList()


    this.setAllocatedCost()


    if (this.$refs.table.$refs.item.every(i => i.locked === true)) {
      this.$refs.table.locked = true
    } else {
      this.$refs.table.locked = false
    }

    this.setPercentAllocation()
  },

  created() {
    this.setShipmentList()
  },

  updated() {
    // this.setCostAllocation()
    // this.setAllocatedCost()
    this.lifeCycleUpdated = true;

    if (this.$refs.table.$refs.item.every(i => i.locked === true)) {
      this.$refs.table.locked = true
    } else {
      this.$refs.table.locked = false
    }
  },

  data() {
    return {
      show: false,
      confirmationShow: false,
      saveConfirmationShow: false,
      updated: false,
      lifeCycleUpdated: false,
      deletableItem: {
        jobItem: {
          name: null
        }
      },

      materialOrderId: null,
      totalCost: 13498.04,
      allocatedCost: 0.00,
      qtyLines: 4,

      typeList: [
        {value: null, text: 'Select...'},
        'FABs',
        'Other',
        'Parts',
        'Services',
        'Stencils',
      ],

      allocationTypeList: [
        {value: null, text: 'Select...'},
        'Inventory',
        'Job'
      ],

      shipmentList: [],

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
          costAllocation: 300,
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
          lastShipmentIn: new Date()
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
          costAllocation: 50.64,
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
          costAllocation: 43.67,
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
    overUnderAllocated: function () {
      if (this.totalAllocatedCost > this.totalCost
          || this.totalAllocatedCost < this.totalCost) {
        return true
      }
      return false
    },

    isNegatives: function () {
      let isNegative = false;
      this.materialOrderItems.forEach((item) => {
        if (Math.sign(item.costAllocation) === -1) {
          isNegative = true;
        }
      })
      if (isNegative) {
        return true
      } else {
        return false
      }
    },

    updatedAndNoNegatives: function () {
      let isNegative = false;
      this.materialOrderItems.forEach((item) => {
        if (Math.sign(item.costAllocation) === -1) {
          isNegative = true;
        }
      })
      if (this.updated && !isNegative) {
        return true;
      } else {
        return false;
      }
    },

    totalAllocatedCost: function () {
      let total = 0;
      this.materialOrderItems.forEach((item) => {
        total += item.costAllocation
      })
      if (total === 0 || total.toFixed(2) === this.totalCost.toFixed(2)) {
        return total.toFixed(2)
      }


      return Number(total.toString().match(/^\d+(?:\.\d{0,2})?/))
    }
  },

  methods: {

    isUpdated: function (jobItem){
      if(this.$refs.table.$refs.item[this.$refs.table.$refs.item
          .indexOf(this.$refs.table.$refs.item.filter(i=>i.item.id === jobItem.id))]
          .item === jobItem){
        return this.$refs.table.$refs.item[this.$refs.table.$refs.item
            .indexOf(this.$refs.table.$refs.item.filter(i=>i.item.id === jobItem.id))].updated
      }
    },


    getMaterialOrderItems: function () {
      // Axios call to get all job items for Material Order
      // axios.get(this.baseURL + 'address/random_address', {
      //   params: {id: this.materialOrderId}
      // }).then((response)=>{
      //   this.materialOrderItems = response
      // })
      let arr = [];
      this.materialOrderItems.forEach((item) => {
        if (!this.shipmentList.includes(item.lastShipmentIn)) {
          item.lastShipmentIn = null;
        }
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

    setShipmentList: function () {
      this.shipmentList = [
        this.getDate(),
      ]
    },

    setUpdated: function (bool) {
      this.updated = bool
    },
    getDate: function () {
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

    handleDistribute: function () {
      this.setUpdated(true);
      this.distributeRemainingDollars();
      this.setPercentAllocation();
    },

    saveChanges: function () {
        this.$refs.table.$refs.item.forEach((item)=>{
          item.updated = false
          item.locked = true
        })

        this.saveConfirmationShow = false;

    },

    distributeRemainingDollars: function () {
      if (this.materialOrderItems) {
        let refArr = [];
        this.materialOrderItems.forEach((jobItem) => {
          let item = this.$refs.table.$refs.item.find(i => i.id === jobItem.id);

          if (item.locked !== true) {
            refArr.push(jobItem)
          }
        })

        let remainder = (this.totalCost - parseFloat(this.totalAllocatedCost))
        let cost = Number((remainder / refArr.length).toString().match(/^\d+(?:\.\d{0,2})?/))

        refArr.forEach((item) => {
          if (refArr.indexOf(item) !== refArr.length - 1) {
            item.costAllocation += cost;
            remainder -= cost;
          } else {
            item.costAllocation += remainder;
          }
        })
      }
    },

    setPercentAllocation: function () {
      let vm = this;
      // this.$refs.table.$refs.item.forEach((item)=>{
      //   if(vm.materialOrderItems[vm.materialOrderItems.indexOf(item.item)]){
      //     item.percentAllocation = ((vm.materialOrderItems[vm.materialOrderItems.indexOf(item.item)].costAllocation / vm.totalCost) * 100).toFixed(2)
      //
      //   }
      // })

      this.materialOrderItems.forEach((item) => {
        if (vm.$refs.table.$refs.item[vm.materialOrderItems.indexOf(item)]) {
          vm.$refs.table.$refs.item[vm.materialOrderItems.indexOf(item)].percentAllocation
              = ((vm.materialOrderItems[vm.materialOrderItems.indexOf(item)].costAllocation / vm.totalCost) * 100).toFixed(2)
        }
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


      console.log('updated', jobItem)
      let itemRef = this.materialOrderItems[this.materialOrderItems.indexOf(this.materialOrderItems.find(i => i.id === jobItem.id))]
      // if(jobItem !== this.materialOrderItems[this.materialOrderItems.indexOf(this.materialOrderItems.find(i=> i.id ===jobItem.id))] && this.lifeCycleUpdated){
      //   this.$refs.table.$refs.item[this.materialOrderItems.indexOf(this.materialOrderItems.find(i=> i.id ===jobItem.id))].updated = true
      // }
      if (!this.compareAllFields(jobItem, itemRef)) {
        this.$refs.table.$refs.item[this.materialOrderItems.indexOf(this.materialOrderItems.find(i => i.id === jobItem.id))].updated = true
      }
      this.$set(this.materialOrderItems, this.materialOrderItems.indexOf(this.materialOrderItems.find(i => i.id === jobItem.id)), jobItem)


    },

    compareAllFields: function (item, itemRef) {
      for (const key in item) {
        if (!(itemRef[key] === item[key])) {
          return false
        }

      }
      return true
    },

    setCostAllocation: function () {
      console.log('setting cost allocation')

      if (this.materialOrderItems) {
        let refArr = [];
        this.materialOrderItems.forEach((jobItem) => {
          let item = this.$refs.table.$refs.item.find(i => i.id === jobItem.id);

          if (item.locked !== true) {
            refArr.push(jobItem)
          }
        })


        refArr.forEach((item) => {
          let vm = this;
          if (refArr.indexOf(item) === refArr.length - 1) {
            let jobItem = {...item};
            jobItem.costAllocation = parseFloat(vm.calculateCostAllocation(jobItem));
            // jobItem.costAllocation = Number(jobItem.costAllocation.toString().match(/^\d+(?:\.\d{0,2})?/))
            // vm.updateJobItem(jobItem)
            if (jobItem.costAllocation !== 0) {
              vm.updateJobItem(jobItem)

              jobItem.costAllocation = Number(jobItem.costAllocation.toString().match(/^\d+(?:\.\d{0,2})?/))

              let remainder = ((vm.totalCost - (vm.totalAllocatedCost)))
              jobItem.costAllocation += remainder;
              jobItem.costAllocation = Number(jobItem.costAllocation.toFixed(2))
              vm.updateJobItem(jobItem)

            }
            else{
              return 0
            }

          } else {

            let otherJobItem = {...item}
            otherJobItem.costAllocation = parseFloat(vm.calculateCostAllocation(otherJobItem));
            otherJobItem.costAllocation = Number(otherJobItem.costAllocation.toString().match(/^\d+(?:\.\d{0,2})?/))
            vm.updateJobItem(otherJobItem)
          }
        })
      }
    },

    calculateCostAllocation: function (jobItem) {
      let total = 0;

      this.materialOrderItems.forEach((item) => {
        if (item.qtyFulfilled && !(this.$refs.table.$refs.item.find(i => i.id === item.id).locked)) {
          total += item.qtyFulfilled
        }
      })
      if (total === 0) {
        return 0
      }
      let ratio = (jobItem.qtyFulfilled / total).toFixed(2);
      return (this.totalCost - this.allocatedCost) * (ratio);
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

    handleSave: function () {
      this.saveConfirmationShow = true;
    },

    getConfirmation: function () {
      this.confirmationShow = true;
    },

    deleteMaterialAllocation: function (item) {
      this.materialOrderItems.splice(this.materialOrderItems.indexOf(this.materialOrderItems.find(i => i.id === item.id)), 1)
      this.confirmationShow = false
      this.setUpdated(true)
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
