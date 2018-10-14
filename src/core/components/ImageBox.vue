<template>
  <v-hover>
      <v-card slot-scope="{ hover }" :class="`elevation-${hover ? 12 : 2}`" class="mx-auto">
          <v-img :src="image.src" class="image"  width="100%" height="100%"  aspect-ratio="1" />
          <v-card-title>
            <div>
              <span class="grey--text">{{image.fileName}}.{{image.type}}</span><br>
              <span>{{image.width}} x {{image.height}}, <span> {{Math.round(image.fileSize/1000)}} KB</span></span><br>
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
  },
};
</script>
