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
          <div v-if="settings.view.showImageName">{{image.fileName}}.{{image.type}}</div>
          <div v-if="settings.view.showImageMeta">{{this.imageMetaInfo}}</div>
          <div v-if="settings.view.showImageUrl">{{image.src}}</div>
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

    settings: {
      type: Object,
      required: true,
    },
  },

  computed: {
    imageMetaInfo: function() {
      return this.image.width + ' x ' + this.image.height + ',' + Math.round(this.image.fileSize / 1000) + 'KB';
    },
    cardStyle: function() {
      // Display as Thumbnail by default
      const thumbWidth = this.settings.view.thumbnailWidth;
      let style = {
        width: thumbWidth + 'px',
      };

      if (this.settings.view.viewMode == 'FitWidth') {
        style = {
          width: '100%',
        };
      } else if (this.settings.view.viewMode == 'Percent100') {
        style = {
          // set a very large width to show full image
          width: '999999px',
        };
      }
      return style;
    },

    boxStyle: function() {
      const thumbWidth = this.settings.view.thumbnailWidth;
      let style = {
        display: 'flex',
        'align-items': 'center',
      };

      if (this.settings.view.viewMode == 'Percent100') {
        style = {};
      }
      return style;
    },

    imageStyle: function() {
      const img = this.image;
      const thumbWidth = this.settings.view.thumbnailWidth;
      var imageRate = thumbWidth / Math.max(img.width, img.height, 1);
      if (imageRate > 1 || this.settings.view.viewMode != 'Thumbnail') {
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
  min-height: 50px;
}
.ip-image {
}
</style>
