<template>
  <v-hover>
    <v-card
      slot-scope="{ hover }"
      :class="`elevation-${hover ? 12 : 2}`"
      class="ip-imageCard"
      :style="cardStyle"
    >
      <div class="ip-imageBox" :style="boxStyle">
        <v-img
          :src="image.src"
          class="ip-image"
          :style="imageStyle"
          contain
          :aspect-ratio="image.width/image.height"
        />
      </div>
      <v-card-title v-if="showCaption">
        <v-layout column>
          <div v-if="settings.view.showImageName" class="caption">{{image.fileName}}.{{image.type}}</div>
          <div
            class="caption"
            v-if="settings.view.showImageMeta"
          >{{image.width}} x {{image.height}}, {{Math.round(image.fileSize/1000)}} KB</div>
          <div v-if="settings.view.showImageUrl" class="caption">{{image.src}}</div>
        </v-layout>
      </v-card-title>
    </v-card>
  </v-hover>
</template>

<script>
export default {
  props: {
    image: {
      type: Object,
      required: true,
    },
    boxWidth: {
      type: Number,
      required: true,
    },
    settings: {
      type: Object,
      required: true,
    },
  },

  computed: {
    cardStyle: function() {
      // Display as Thumbnail by default
      let style = {
        width: this.boxWidth + 'px',
      };

      if (this.settings.view.viewMode != 'Thumbnail') {
        style = {
          width: '100%',
        };
      }
      return style;
    },

    boxStyle: function() {
      return {};
    },

    imageStyle: function() {
      const img = this.image;

      var imageRate = this.boxWidth / Math.max(img.width, img.height, 1);
      if (imageRate > 1 || this.settings.view.viewMode == 'Percent100') {
        // for small image, no change
        imageRate = 1;
      }
      //Sometimes, image is not load completed, width or height may is 0
      var imgWidth = Math.max(imageRate * img.width, 1);
      var imgHeight = Math.max(imageRate * img.height, 1);
      return {
        width: imgWidth + 'px',
        height: imgHeight + 'px',
      };
    },

    showCaption: function() {
      const showName = this.settings.view.showImageName;
      const showMeta = this.settings.view.showImageMeta;
      const showURL = this.settings.view.showImageUrl;

      return showName || showMeta || showURL;
    },
  },
};
</script>
<style>
.ip-imageCard {
  margin-bottom: 20px;
  float: left;
}

.ip-imageBox {
  display: flex;
  min-height: 100px;
  align-items: center;
}
.ip-image {
}
</style>
