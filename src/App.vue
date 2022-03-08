<template>
  <div id="app">
    <b-container>
      <div class="header-bar clearfix mb-1">
        <div class="right" style="float: right">
          <b-button variant="secondary" size="sm" class="mr-3">
            Upload Changes
          </b-button>
          <b-button @click="show = !show"  variant="primary" size="sm">
            Add New
          </b-button>
        </div>


      </div>

      <material-order-table :job-items="jobItems" @delete="handleDelete">

      </material-order-table>
      <modal-entry
          :show="show"
          @close="show = false"
          @create-new-material-allocation="createNewMaterialAllocation">
      </modal-entry>


      <b-modal @cancel="resetDeletableItem" @ok="deleteMaterialAllocation(deletableItem)" v-model="confirmationShow">
        <template #modal-header>
          <div class="w-100">
            Are you Sure?
          </div>
        </template>
        Delete This Material Allocation?<br>
        {{deletableItem.jobItem}}
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

  data(){
    return{
      show: false,
      confirmationShow: false,
      deletableItem: {
        jobItem: null
      },
      jobItems: [
        {
          id: Math.random(),
          type: 'Parts',
          inventoryType: 'Type',
          jobItem: 'TPS-30961-A_2022-02-15',
          jobItemQty: 2,
          qtyFulfilled: 1,
          costAllocation: null,
          qtyLines: null,
          lastShipmentIn: new Date().toLocaleString('en-us'),
        },
        {
          id: Math.random(),
          type: 'Parts',
          inventoryType: 'Type',
          jobItem: 'TPS-30961-A_2022-02-15',
          jobItemQty: 2,
          qtyFulfilled: 2,
          costAllocation: null,
          qtyLines: null,
          lastShipmentIn: new Date().toLocaleString('en-us'),
        },
        {
          id: Math.random(),
          type: 'Parts',
          inventoryType: 'Type',
          jobItem: 'TPS-30961-A_2022-02-15',
          jobItemQty: 2,
          qtyFulfilled: 3,
          costAllocation: null,
          qtyLines: null,
          lastShipmentIn: new Date().toLocaleString('en-us'),
        },
        {
          id: Math.random(),
          type: 'Parts',
          inventoryType: 'Type',
          jobItem: 'TPS-30961-A_2022-02-15',
          jobItemQty: 2,
          qtyFulfilled: 2,
          costAllocation: null,
          qtyLines: null,
          lastShipmentIn: new Date().toLocaleString('en-us'),
        },
        {
          id: Math.random(),
          type: 'Parts',
          inventoryType: 'Type',
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

  methods: {
    resetDeletableItem: function (){
      this.deletableItem = {
        jobItem: null
      }
    },

    createNewMaterialAllocation: function (arr){
      console.log(arr)
    },

    handleDelete: function (item){
      this.deletableItem = item;
      this.getConfirmation();
    },

    getConfirmation: function (){
      this.confirmationShow = true;
    },

    deleteMaterialAllocation: function (item){
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
