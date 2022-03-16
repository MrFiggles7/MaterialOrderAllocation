<template>
  <div id="app">
    <b-container>
      <div style="width: 1108px; position: relative;">
        <div class="header-bar clearfix mb-1">
          <div class="left" style="float: left">
            Total Order Cost: <span :style="overUnderAllocated ? 'color: red' : ''">{{ totalAllocatedCost }}</span> /
            {{ totalCost }}
          </div>

          <div class="right" style="float: right">
            <span v-if="insufficientFunds"
                  class="mr-3"
                  style="color: red; font-size: .8rem"
            >
              No Remaining Dollars to Distribute
            </span>

            <b-button :disabled="buttonDisabled"
                      :variant="!buttonDisabled ? 'success' : 'light'"
                      size="sm"
                      class="mr-3"
                      @click="handleSave"
            >
              Save Changes
              <b-icon :variant="!buttonDisabled ? 'light' : 'dark'" icon="upload"></b-icon>
            </b-button>

            <b-button :disabled="loading" @click="show = !show" variant="secondary" size="sm">
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
            :loading="loading"
            @delete="handleDelete"
            @update-job-item="updateJobItem"
            @set-cost-allocation="setCostAllocation"
            @set-quantity="setQuantity"
            @set-allocated-cost="setAllocatedCost"
            @set-updated="setUpdated"
        >
        </material-order-table>
        <div style="float: left;" class="mt-1">
          <b-button @click="resetTableData" :disabled="loading" variant="outline-danger" size="sm">
            Reset Table Data
            <b-icon class="ml-2" icon="arrow-clockwise"></b-icon>
          </b-button>
        </div>


        <div style="float: right;" class="mt-1">
          <b-button :disabled="loading" class="mr-3" @click="handleDistribute" variant="outline-info" size="sm">
            Distribute Remaining Dollars
            <b-icon class="ml-2" icon="shuffle"></b-icon>
          </b-button>
          <b-button :disabled="loading" @click="handleSplit" variant="info" size="sm">
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
        <b-modal no-close-on-backdrop header-class="text-center" body-class="text-center" v-model="confirmationShow">
          <template #modal-header>
            <div class="w-100 font-weight-bold" style="font-size: 1.4rem">
              Are you Sure?
            </div>
          </template>

          <span>Permanently Delete This Material Allocation?</span><br>
          <span class="font-weight-bold">{{ deletableItem.jobItem.name }}</span>
          <template #modal-footer>
            <b-button class="mr-auto" variant="secondary" @click="confirmationShow = false">Cancel</b-button>
            <b-button variant="danger" @click="deleteMaterialAllocation(deletableItem)">Delete</b-button>
          </template>
        </b-modal>


        <!--      //Save Changes Modal-->
        <b-modal no-close-on-backdrop
                 modal-class="text-center"
                 :body-class="loading ? 'disabled' : ''"
                 :header-class="loading ? 'disabled' : ''"
                 :footer-class="loading ? 'disabled' : ''"
                 v-model="saveConfirmationShow">
          <div v-if="loading" style="
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
          "
          >
            <div style="
            position: relative;
             height: 100%;
             display: flex;
             flex-flow: column;">
              <b-icon
                  style="display: flex; flex-flow: column;margin: auto;"
                  icon="arrow-counterclockwise"
                  animation="spin-reverse"
                  font-scale="6"></b-icon>
            </div>

          </div>
          <template #modal-header>
            <div class="w-100 font-weight-bold" style="font-size: 1.4rem">
              Are you Sure?
            </div>
          </template>

          <span>Save These Changes to the Database?</span><br>
          <span v-for="item in updatedMaterialOrderItems" :key="item.id">
            <span class="font-weight-bold">{{
                item.jobItem.name
              }}:</span><br><span>Cost Allocation: ${{ item.costAllocation.toLocaleString() }}</span><br>
          </span>

          <template #modal-footer>
            <b-button
                :disabled="loading"
                class="mr-auto"
                variant="secondary"
                @click="saveConfirmationShow = false">
              Cancel
            </b-button>
            <b-button
                :disabled="loading"
                variant="success"
                @click="saveChanges()">
              Save Changes
            </b-button>
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

  watch: {
    materialOrderItems: function () {
      this.updatedMaterialOrderItems = this.getUpdatedMaterialOrderItems()
    }
  },

  mounted() {
    // axios calls to get all existing job items and
    // set the type and allocation type lists
    this.getMaterialOrderItems()
    this.updatedMaterialOrderItems = this.getUpdatedMaterialOrderItems()
    this.materialOrderItemsRef = [...this.materialOrderItems];
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
    // this.updatedMaterialOrderItems = this.getUpdatedMaterialOrderItems()

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
      loading: false,
      lifeCycleUpdated: false,
      insufficientFunds: false,
      deletableItem: {
        jobItem: {
          name: null
        }
      },

      materialOrderId: null,
      updatedMaterialOrderItems: [],
      totalCost: 13493.77,
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

      materialOrderItemsRef: [],
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

    buttonDisabled: function () {
      if (!this.updatedAndNoNegatives || this.loading) {
        return true
      }
      return false
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
        return Number(total.toFixed(2))
      }


      return Number(total.toString().match(/^\d+(?:\.\d{0,2})?/))
    }
  },

  methods: {

    resetTableData: function (){
      this.loading = true;
      let vm = this;

      setTimeout(function (){
        vm.materialOrderItems = [...vm.materialOrderItemsRef]
        vm.resetAllStatuses()
        vm.loading = false;
      }, 500)
    },

    resetAllStatuses: function (){
        this.$refs.table.$refs.item.forEach((item)=>{
          item.updated = false
        })
    },

    setBroke: function (bool) {
      if (bool === true) {
        this.insufficientFunds = true
        let vm = this
        setTimeout(function () {
          vm.insufficientFunds = false
        }, 3000)
      } else {
        this.insufficientFunds = false;
      }
    },

    getUpdatedMaterialOrderItems: function () {
      let updatedItems = [];

      this.$refs.table.$refs.item.forEach((item) => {
        if (item.updated) {
          updatedItems.push(item.item)
        }
      })
      return updatedItems
    },

    isUpdated: function (jobItem) {
      if (this.$refs.table.$refs.item[this.$refs.table.$refs.item
          .indexOf(this.$refs.table.$refs.item.filter(i => i.item.id === jobItem.id))]
          .item === jobItem) {
        return this.$refs.table.$refs.item[this.$refs.table.$refs.item
            .indexOf(this.$refs.table.$refs.item.filter(i => i.item.id === jobItem.id))].updated
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

        this.setBroke(false)
        this.setUpdated(true)
        this.setAllocatedCost()
        this.setCostAllocation()
        this.setPercentAllocation()

    },

    handleDistribute: function () {
      if (this.totalCost !== this.totalAllocatedCost) {
        this.setBroke(false)
          this.setUpdated(true);
          this.distributeRemainingDollars();
          this.setPercentAllocation();
      } else {
        this.setBroke(true)
      }
    },

    saveChanges: function () {
      this.loading = true;
      let vm = this;

      setTimeout(function () {
        vm.$refs.table.$refs.item.forEach((item) => {
          item.updated = false
          item.locked = true
        })

        vm.saveConfirmationShow = false;
        vm.updated = false
        vm.loading = false
      }, 1000)


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
        if (!(itemRef[key] === item[key]) && key !== 'qtyFulfilled') {
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

            } else {
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
      this.loading = true;
      let vm = this;

      setTimeout(function () {
        arr.data.forEach((item) => {
          vm.materialOrderItems.push(new MaterialOrderItem(
              Math.random(),
              arr.type,
              arr.allocationType,
              item,
              0,
              0,
              vm.qtyLines,
              vm.getDate(),
          ))
        })
        vm.loading = false
      }, 250)

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

.disabled {
  background-color: rgba(0, 0, 0, .4);
}
</style>
