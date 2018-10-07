<template>
    <v-container fluid grid-list-sm dark>
        <v-layout row wrap>
            <v-flex v-for="img in images" :key="img.id" xs4 @click="$emit('image-clicked', img.id)">
              <ImageBox :image="img" /> 
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import ImageBox from "./ImageBox.vue";

export default {
  props: {
    images: {
      type: Array,
      required: true
    }
  },
  components: {
    ImageBox
  }
};
</script>

    