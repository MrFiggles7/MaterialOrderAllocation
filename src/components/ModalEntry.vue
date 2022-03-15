<template>
  <b-modal size="lg" v-model="showRef" centered id="modal-1" title="New Material Allocation">
    <b-row class="pl-5 pr-5 align-content-center" style="height: 23rem">
      <b-col>
        <b-form>
          <div style="position: relative">
            <label v-if="selectJob"
                    style="font-size: .6rem;
                    color: red;
                    position: absolute; bottom: 0%;"
                   for="this-selected-job">
              Job Must Be selected
            </label>
            <label class="m-0 pl-2" for="this-selected-job">
              Job:
            </label>
            <b-form-select
                class="mb-4"
                id="this-selected-job"
                v-model="selectedJob"
                :options="jobsList"
            ></b-form-select>
          </div>
          <div style="position: relative">
            <label v-if="selectAllocationType"
                    style="font-size: .6rem;
                    color: red;
                    position: absolute; bottom: 0%;"
                   for="this-selected-allocation">
              Allocation must be selected
            </label>
            <label class="m-0 pl-2" for="this-selected-allocation">
              Allocation Type:
            </label>
            <b-form-select
                class="mb-4"
                id="this-selected-allocation"
                v-model="selectedAllocationType"
                :options="allocationTypeList"
            ></b-form-select>
          </div>
          <div style="position: relative">
            <label v-if="selectMaterialType"
                   style="font-size: .6rem;
                    color: red;
                    position: absolute; bottom: -40%;"
                   for="this-selected-material">
              Material Type must be selected
            </label>
            <label class="m-0 pl-2" for="this-selected-material">
              Material Type:
            </label>
            <b-form-select
                id="this-selected-material"
                v-model="selectedType"
                :options="typeList"
            ></b-form-select>
          </div>

        </b-form>
      </b-col>
      <b-col class="p-0">
          <div style="position: relative">
            <label v-if="checkJobItems"
                   style="font-size: .6rem;
                    color: red;
                    position: absolute; top: -5%; left: 2%"
                   for="this-checked-jobitems"
            >
              Job Item(s) Must be Checked
            </label>
            <b-card
                style="position: relative; overflow-y: scroll; max-height: 21rem"
                id="this-checked-jobitems"
                v-if="selectedJob !== null">

              <b-card-header class="p-0 clearfix" style="background-color: inherit;">
                Open Job Items
                <a v-if="!allSelected" @click="selectAll(true)" href="#" style="font-size: .6rem; float: right">Select All</a>
                <a v-if="allSelected" @click="selectAll(false)" href="#" style="font-size: .6rem; float: right">UnSelect All</a>

              </b-card-header>
              <b-card-body>
                <b-form-checkbox
                    v-for="item in jobItemList"
                    :key="item.id"
                    v-model="item.checked"

                >
                  {{item.name}}
                </b-form-checkbox>
              </b-card-body>
            </b-card>
          </div>

      </b-col>
    </b-row>



    <template #modal-footer>
      <div class="w-100">
        <b-button
            variant="secondary"
            size="sm"
            class="float-left"
            @click="showRef = false"
        >
          Cancel
        </b-button>
        <b-button
            variant="primary"
            size="sm"
            class="float-right"
            @click="validate"
        >
          Add Material Allocation
        </b-button>
      </div>
    </template>
  </b-modal>
</template>

<script>
// import axios from "axios";

export default {
  name: "ModalEntry",

  mounted(){
    // Get All Open Jobs
    // this.jobList = [];
    // axios.get(this.baseURL + '').then((response)=>{
    //     response.forEach((res)=>{
    //       this.jobList.push(
    //           res
    //       )
    //     })
    // })
  },

  methods: {
    validate: function (){
      if(!this.selectedJob){
        this.selectJob = true;
      }
      else{
        this.selectJob = false;
      }
      if(!this.selectedAllocationType){
        this.selectAllocationType = true;
      }
      else{
        this.selectAllocationType = false;
      }
      if(!this.selectedType){
        this.selectMaterialType = true;
      }
      else{
        this.selectMaterialType = false;
      }
      if(!this.jobItemList.some(i=>i.checked === true)){
        if(this.selectedJob){
          this.checkJobItems = true
        }
      }
      else{
        this.checkJobItems = false;
      }
      if(!this.selectJob
          && !this.selectMaterialType
          && !this.selectAllocationType
          && !this.checkJobItems){
        this.createNewMaterialAllocation();
      }
    },

    resetErrors: function (){
      this.selectJob = false;
      this.selectAllocationType = false;
      this.selectMaterialType = false;
      this.checkJobItems = false;
    },

    resetVariables: function (){
      this.selectedJob = null;
      this.selectedAllocationType = null;
      this.selectedType = null;
      this.jobItemList.forEach((item)=>{
        item.checked = false;
      })
    },

    selectAll: function (bool){
      this.jobItemList.forEach((item)=>{
        item.checked = bool
      })
      this.allSelected = bool
    },

    createNewMaterialAllocation: function (){
      let refArr = [];
      this.jobItemList.forEach((item)=>{
        if(item.checked){
          refArr.push({
            id: item.id,
            name: item.name,
            qty: item.qty
          })
        }
      })
      let jobList = {
        data: refArr,
        type: this.selectedType,
        allocationType: this.selectedAllocationType,
      }

      this.showRef = false;
      this.$emit('create-new-material-allocation', jobList)
    }
  },

  watch: {
    selectedJob: function (){

      // Set JobItemList After Job Is Picked
      // this.jobItemList = [];
      // axios.get(this.baseURL + '').then((response)=>{
      //   response.forEach((res)=>{
      //     this.jobItemList.push(
      //         {
      //           id: res.id,
      //           name: res.name,
      //           checked: false,
      //         }
      //     )
      //   })
      // })
    },

    showRef: function (){
      this.$emit('update-show', this.showRef)
    },

    show: function (){
      if(this.show === false){
        this.resetErrors();
        this.resetVariables();
      }
      this.showRef = this.show;
    }
  },

  data(){
    return {
      selectedJob: null,
      selectedType: null,
      selectedAllocationType: null,
      showRef: false,

      checkJobItems: false,
      selectJob: false,
      selectAllocationType: false,
      selectMaterialType: false,

      allSelected: false,

      jobsList: [
        {value: null, text: 'Select...'},
          'TPS-40961-A',
          'TPS-40961-A',
          'TPS-40961-A',
          'TPS-40961-A',
          'TPS-40961-A',
          'TPS-40961-A',
          'TPS-40961-A',
          'TPS-40961-A',
          'TPS-40961-A',
          'TPS-40961-A',
          'TPS-40961-A',
          'TPS-40961-A',
          'TPS-40961-A',
      ],



      jobItemList: [
        {
          id: Math.random(),
          name: 'TPS-04961-A_2022-04-16',
          qty: 2,
          checked: false,
        },
        {
          id: Math.random(),
          name: 'TPS-04961-A_2022-04-16',
          qty: 2,
          checked: false,
        },
        {
          id: Math.random(),
          name: 'TPS-04961-A_2022-04-16',
          qty: 2,
          checked: false,
        },
        {
          id: Math.random(),
          name: 'TPS-04961-A_2022-04-16',
          qty: 2,
          checked: false,
        },
        {
          id: Math.random(),
          name: 'TPS-04961-A_2022-04-16',
          qty: 2,
          checked: false,
        },
        {
          id: Math.random(),
          name: 'TPS-04961-A_2022-04-16',
          qty: 2,
          checked: false,
        },
        {
          id: Math.random(),
          name: 'TPS-04961-A_2022-04-16',
          qty: 2,
          checked: false,
        },
        {
          id: Math.random(),
          name: 'TPS-04961-A_2022-04-16',
          qty: 2,
          checked: false,
        },
        {
          id: Math.random(),
          name: 'TPS-04961-A_2022-04-16',
          qty: 2,
          checked: false,
        },
        {
          id: Math.random(),
          name: 'TPS-04961-A_2022-04-16',
          qty: 2,
          checked: false,
        },
        {
          id: Math.random(),
          name: 'TPS-04961-A_2022-04-16',
          qty: 2,
          checked: false,
        },
        {
          id: Math.random(),
          name: 'TPS-04961-A_2022-04-16',
          qty: 2,
          checked: false,
        },
      ],
    }
  },

  created() {
    this.showRef = this.show;
  },

  props: {
    show: Boolean,
    typeList: Array,
    allocationTypeList: Array,
    baseURL: String,
  }
}
</script>

<style scoped>

</style>