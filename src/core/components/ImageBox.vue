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
      <v-card-title>
        <div>
          <span class="grey--text">{{image.fileName}}.{{image.type}}</span>
          <br>
          <span>
            {{image.width}} x {{image.height}},
            <span>{{Math.round(image.fileSize/1000)}} KB</span>
          </span>
          <br>
          <span>{{image.src}}</span>
        </div>
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
  },

  computed: {
    cardStyle: function() {
      return {
        width: this.boxWidth + 'px',
        //height: this.boxWidth + 120 + 'px',
      };
    },

    boxStyle: function() {
      return {
        width: this.boxWidth + 'px',
        // height: this.boxWidth + 'px',
        // 'line-height': this.boxWidth + 'px',
      };
    },

    imageStyle: function() {
      const img = this.image;
      var imageRate = this.boxWidth / Math.max(img.width, img.height, 1);
      if (imageRate > 1) {
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
