<template>
  <v-container fluid>
    <v-layout row fill-height wrap="true">
      <v-flex v-for="img in images" :key="img.id">
        <div @click="$emit('image-clicked', img.id)">
          <ImageBox :image="img" :boxWidth="240" :settings="settings"/>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import ImageBox from './ImageBox.vue';

export default {
  props: {
    images: {
      type: Array,
      required: true,
    },
    settings: {
      type: Object,
      required: true,
    },
  },
  components: {
    ImageBox,
  },
};
</script>
