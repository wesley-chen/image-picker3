<template>
    <v-list subheader>

          <v-subheader >Domain</v-subheader>

          <v-list-tile v-for="domain in filter.domains" :key="domain.name" >
                        <v-checkbox v-model="domain.selected" :label="domain.name" 
                                    @change="$emit('filter-change')"/>
                        <span class="grey--text">{{domain.count}}</span>   
          </v-list-tile>

          <v-subheader >Image Types</v-subheader>

          <v-list-tile v-for="(group, idx) in imageTypeGroups" :key="'Group-'+idx">
                <v-layout row wrap >
                    <v-flex sm4 v-for="imgType in group" :key="imgType.name">
                        <v-checkbox v-model="imgType.selected" :label="imgType.name"
                                    @change="$emit('filter-change')"
                        ></v-checkbox>
                    </v-flex>
                </v-layout>
          </v-list-tile>
          
          <v-subheader >Limits</v-subheader>

          <v-list-tile >
             <InputRange title="Size" unit="KB" :range="filter.sizeLimit" @range-change="$emit('filter-change')"/>
          </v-list-tile>

         <v-list-tile >
            <InputRange title="Width" unit="px" :range="filter.widthLimit" @range-change="$emit('filter-change')"/>
          </v-list-tile>

          <v-list-tile >
            <InputRange title="Height" unit="px" :range="filter.heightLimit" @range-change="$emit('filter-change')"/>
          </v-list-tile>

    </v-list>
</template>

<script>
import InputRange from "./InputRange";
export default {
  props: {
    filter: {
      type: Object,
      required: true
    }
  },
  computed: {
    imageTypeGroups: function() {
      let groups = [];
      let groupSize = 3;
      let imageTypes = this.filter.imageTypes;
      for (let i = 0; i < imageTypes.length; i += groupSize) {
        groups.push(imageTypes.slice(i, i + groupSize));
      }
      return groups;
    }
  },
  components: {
    InputRange
  }
};
</script>

<style>
.v-subheader {
  margin-top: 15px;
}
</style>


