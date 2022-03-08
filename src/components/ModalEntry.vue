<template>
  <b-modal size="lg" v-model="show" centered id="modal-1" title="New Material Allocation">
    <b-row class="p-5">
      <b-col>
        <b-form>
          <b-form-select
              class="mb-4"
              v-model="selectedJob"
              :options="jobsList"
          ></b-form-select>
          <b-form-select
              v-model="selectedType"
              :options="typeList"
          ></b-form-select>
        </b-form>
      </b-col>
      <b-col>
          <b-card v-if="selectedJob !== null">
            <b-card-header class="p-0 clearfix" style="background-color: inherit">
              Open Job Items
              <a @click="selectAll" href="#" style="font-size: .6rem; float: right">Select All</a>
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
            <b-card-footer class="p-0 clearfix" style="background-color: inherit">
              <a href="#" style="font-size: .6rem; float: right">Show More</a>
            </b-card-footer>
          </b-card>
      </b-col>
    </b-row>



    <template #modal-footer>
      <div class="w-100">
        <b-button
            variant="secondary"
            size="sm"
            class="float-left"
            @click="$emit('close')"
        >
          Cancel
        </b-button>
        <b-button
            variant="primary"
            size="sm"
            class="float-right"
            @click="createNewMaterialAllocation"
        >
          Add Material Allocation
        </b-button>
      </div>
    </template>
  </b-modal>
</template>

<script>
export default {
  name: "ModalEntry",

  methods: {
    selectAll: function (){
      this.jobItemList.forEach((item)=>{
        item.checked = true
      })
    },

    createNewMaterialAllocation: function (){
      this.$emit('create-new-material-allocation', this.jobItemList.filter(i => i.checked === true).map(j => {
        return j.name
      }))
    }
  },

  data(){
    return {
      selectedJob: null,
      selectedType: null,
      jobsList: [
        {value: null, text: 'Please select a Job'},
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
        'TPS-40961-A'
      ],

      typeList: [
        {value: null, text: 'Supplied Material Type'},
          'FABs',
          'Other',
          'Parts',
          'Services',
          'Stencils',
      ],

      jobItemList: [
        {
          name: 'TPS-04961-A_2022-04-16',
          checked: false,
        },
        {
          name: 'TPS-04961-A_2022-04-16',
          checked: false,
        },
        {
          name: 'TPS-04961-A_2022-04-16',
          checked: false,
        },
        {
          name: 'TPS-04961-A_2022-04-16',
          checked: false,
        },
        {
          name: 'TPS-04961-A_2022-04-16',
          checked: false,
        },
        {
          name: 'TPS-04961-A_2022-04-16',
          checked: false,
        }
      ],
    }
  },

  props: {
    show: Boolean,
  }
}
</script>

<style scoped>

</style>