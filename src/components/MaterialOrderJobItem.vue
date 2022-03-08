<template>
  <tr class="table-body" :style="locked ? 'background-color: rgba(255,0,0,.1)' : ''">
    <td>{{ index }}</td>
    <td

    >
      {{ type }}
    </td>
    <td

    >
      {{ inventoryType }}
    </td>
    <td
        style="max-width: 5rem"

    >
      {{ jobItem }}
    </td>
    <td style="max-width: 2rem; min-width: 2rem">
      <div style="display: inline-block; vertical-align: sub;">
        {{ jobItemQty }}
      </div>
      <b-button
          class="table-button"
          size="sm"
          variant="outline-secondary"
          @click="setQtyFulfilled"
      >
        <b-icon scale=".75" icon="chevron-double-right"></b-icon>
      </b-button>
      <b-icon
          style="float: right; margin-right: .5rem"
          variant="primary"
          v-if="!jobItemQtyMatch"
          icon="info-circle"
          font-scale="2"
      >
      </b-icon>
    </td>
    <td style="max-width: 3rem">
      <b-input
          :disabled="locked"
          style="vertical-align: sub"
          type="text"
          class="w-50"
          :value="qtyFulfilled"
      >
      </b-input>
      <b-button @click="locked = !locked" class="table-button" size="sm" variant="outline-secondary">
        <b-icon scale=".75" :icon="locked ? 'lock-fill' : 'unlock-fill'"></b-icon>
      </b-button>
    </td>
    <td style="max-width: 2rem">
      <b-input
          style="vertical-align: text-top"
          type="text"
          placeholder="$"
          class="w-100"
          :value="costAllocation">
      </b-input>
    </td>
    <td style="max-width: 2rem">
      <b-input
          style="vertical-align: text-top"
          type="text"
          placeholder="%"
          class="w-100"
          :value="percentAllocation">
      </b-input>
    </td>
    <td style="max-width: 2rem">
      <b-input
          style="vertical-align: text-top"
          type="number"
          class="w-100"
          :value="qtyLines">
      </b-input>
    </td>
    <td style="max-width: 3rem">
      {{ lastShipmentIn }}
      <b-button
          class="table-button"
          style="border: none"
          size="sm"
          variant="outline-light"
          @click="$emit('delete')"
      >
        <b-icon variant="danger" scale=".75" icon="trash"></b-icon>
      </b-button>
    </td>
  </tr>
</template>

<script>
export default {
  name: "MaterialOrderJobItem",

  data(){
    return{
      locked: false,
      type: null,
      inventoryType: null,
      jobItem: null,
      jobItemQty: null,
      qtyFulfilled: null,
      costAllocation: null,
      qtyLines: null,
      lastShipmentIn: null
    }
  },

  props: {
    item: {type: Object, twoWay: true},
    index: Number,
  },

  computed: {
    jobItemQtyMatch: function (){
      if(this.jobItemQty === this.qtyFulfilled){
        return true
      }
      else{
        return false;
      }
    },

    percentAllocation: function (item){
      return item.costAllocation;
    },
  },

  watch: {
    item: {
      deep: true,
      immediate: true,
      handler(){
        this.resetItemRef()
      }
    }
  },

  methods: {

    resetItemRef: function (){
      for(let key in this.item){
        this[key] = this.item[key]
      }
    },

    setQtyFulfilled: function (){
      if(this.locked !== true){
        this.qtyFulfilled = this.item.jobItemQty
      }
    },

  },

  created() {
    this.resetItemRef()
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

.table-body:hover{
  background-color: rgba(0,0,0,.1);
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
  /*border: 1px solid rgba(0,0,0, .4);*/
  border-radius: inherit;
  transition: none;
}

.form-control:focus {
  border: 2px solid black;
  box-shadow: none;
}
</style>