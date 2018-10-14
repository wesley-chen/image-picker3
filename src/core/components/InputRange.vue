<template>
      <v-layout row align-baseline justify-start fill-height>
          <v-flex sm4 align-baseline>
            {{title}}
          </v-flex>
          <v-flex sm3>
            <v-text-field v-model.number="range.min" 
                 @change="$emit('range-change')"
                 class="input-range-num"
                 hide-details single-line 
                 :hint="minHint"
                 type="number">     
            </v-text-field> 
          </v-flex>
          <v-flex sm2 class="input-range-text">
             - 
          </v-flex>
          <v-flex sm3>
                <v-text-field v-model.number="range.max" 
                    @change="$emit('range-change')"
                    class="input-range-num"
                     single-line 
                    :hint="maxHint"
                    type="number">     
                </v-text-field> 
          </v-flex>
      </v-layout>     
</template>

<script>
export default {
  props: {
    range: {
      type: Object,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
  },

  computed: {
    minHint: function() {
      return 'The minimum value of ' + this.title + ' (' + this.unit + ')';
    },
    maxHint: function() {
      return 'The maximum value of ' + this.title + ' (' + this.unit + ')';
    },
  },
};
</script>
<style>
.input-range-num input {
  text-align: right;
}
.input-range-text {
  text-align: center;
}
</style>
