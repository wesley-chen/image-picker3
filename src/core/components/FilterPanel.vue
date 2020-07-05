<template>
  <v-list>
    <v-subheader>Domain</v-subheader>

    <v-list-item v-for="domain in filter.domains" :key="domain.name">
      <v-list-item-action>
        <v-checkbox
          v-model="domain.selected"
          @change="$emit('filter-change')"
        />
      </v-list-item-action>

      <v-list-item-content>
        <v-list-item-subtitle v-text="domain.name" />
      </v-list-item-content>

      <v-list-item-action>
        <v-list-item-action-text v-text="domain.count" />
      </v-list-item-action>
    </v-list-item>

    <v-subheader>Image Types</v-subheader>

    <v-list-item v-for="(group, idx) in imageTypeGroups" :key="'Group-' + idx">
      <v-list-item-action v-for="imgType in group" :key="imgType.name">
        <v-checkbox
          v-model="imgType.selected"
          :label="imgType.name"
          @change="$emit('filter-change')"
        />
      </v-list-item-action>
    </v-list-item>

    <v-subheader>Limits</v-subheader>

    <InputRange
      title="Size"
      unit="KB"
      :range="filter.sizeLimit"
      @range-change="$emit('filter-change')"
    />
    <InputRange
      title="Width"
      unit="px"
      :range="filter.widthLimit"
      @range-change="$emit('filter-change')"
    />
    <InputRange
      title="Height"
      unit="px"
      :range="filter.heightLimit"
      @range-change="$emit('filter-change')"
    />
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
