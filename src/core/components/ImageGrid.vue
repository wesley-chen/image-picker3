<template>
  <v-container fluid>
    <v-row :row="isThumbnail" :column="!isThumbnail" wrap="true">
      <v-col v-for="img in images" :key="img.id">
        <div @click="$emit('image-clicked', img.id, $event)">
          <ImageBox :image="img" :settings="settings" />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ImageBox from "./ImageBox.vue";

export default {
  props: {
    images: {
      type: Array,
      required: true
    },
    settings: {
      type: Object,
      required: true
    }
  },
  components: {
    ImageBox
  },

  computed: {
    isThumbnail: function() {
      return this.settings.view.viewMode == "Thumbnail";
    }
  }
};
</script>
