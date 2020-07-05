<template>
  <v-list-item>
    <v-list-item-action>
      <v-text-field
        dense
        style="font-size: 0.75rem; width:120px;"
        v-model.number="range.min"
        @change="$emit('range-change')"
        :label="'Min ' + title"
        type="number"
        :suffix="unit"
      ></v-text-field>
    </v-list-item-action>
    <v-list-item-action>
      <v-text-field
        dense
        style="font-size: 0.75rem; width:120px;"
        v-model.number="range.max"
        @change="$emit('range-change')"
        :label="'Max ' + title"
        type="number"
        :suffix="unit"
      ></v-text-field>
    </v-list-item-action>
    <v-list-item-content>
      <v-list-item-title v-text="title" />
    </v-list-item-content>
  </v-list-item>
</template>

<script>
export default {
  props: {
    range: {
      type: Object,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    unit: {
      type: String,
      required: true
    }
  },

  computed: {
    minHint: function() {
      return "The minimum value of " + this.title + " (" + this.unit + ")";
    },
    maxHint: function() {
      return "The maximum value of " + this.title + " (" + this.unit + ")";
    }
  }
};
</script>
