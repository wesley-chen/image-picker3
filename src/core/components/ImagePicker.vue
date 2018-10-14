<template>
  <v-app persistent :dark="themeDark" >

    <v-navigation-drawer persistent enable-resize-watcher fixed app
            v-model="drawer" >
        <FilterPanel :filter="filter" v-on:filter-change="onFilterChange"/>
    </v-navigation-drawer>

    <v-toolbar app :clipped-left="clipped" id="toolbar-ip" >

      <v-btn icon @click.stop="drawer = !drawer">
        <v-icon v-html="drawer ?  'chevron_left': 'chevron_right'"></v-icon>
      </v-btn>

      <v-tabs v-model="activeTabIdx" centered slider-color="yellow" 
            color="transparent">
            <v-tab @click="showTab(0)">
                    Selected 
                    <span > ({{this.selectedImageCount}})</span>
            </v-tab>
            <v-tab @click="showTab(1)">
                UnSelected 
                <span > ({{this.unselectedImageCount}})</span>
            </v-tab>
      </v-tabs>

      <v-spacer></v-spacer>

      <v-btn icon @click.stop="themeDark = !themeDark">
        <v-icon>invert_colors</v-icon>
      </v-btn>

      <v-btn icon @click.stop="rightDrawer = !rightDrawer">
        <v-icon>menu</v-icon>
      </v-btn>

    </v-toolbar>

    <v-content>

        <ImageGrid :images="images" v-on:image-clicked="onImageClicked"/>

        <v-btn fab fixed bottom right  @click="saveImages()"
                color="primary" v-show="activeTabIdx == 0">
              <v-icon>cloud_download</v-icon>
        </v-btn>

        <v-snackbar v-model="showSnackbar" top right >
           {{ message }}
           <v-btn color="pink" flat @click="showSnackbar = false" >
                Close
           </v-btn>
        </v-snackbar>

    </v-content>

    <v-footer :fixed="fixed" app class="justify-center">
      <v-spacer></v-spacer>
      <span>Download to</span>
      <v-text-field id="fileNameBox" single-line :value="title"> </v-text-field>
      <v-spacer></v-spacer>
    </v-footer>

  </v-app>
</template>

<script>
import ImageGrid from './ImageGrid';
import FilterPanel from './FilterPanel';
import { initData, getImageDomains, getImageTypes, toValidFileName, Filter, RangeLimit, ImageViewSession } from '../model';

export default {
  name: 'ImagePicker',

  session: null,
  filter: null,

  components: {
    ImageGrid,
    FilterPanel,
  },

  created: function() {
    console.log('created ImagePicker:' + this.$store.state.images.length);
    this.title = this.$store.state.title;
    this.session = new ImageViewSession(this.$store.state.images, this.title);

    let allImages = this.session.allImages;
    let domainData = getImageDomains(allImages);
    let typeData = getImageTypes(allImages);
    this.filter = new Filter(domainData, typeData, new RangeLimit(0, 6000, true), new RangeLimit(null, 3000, true), new RangeLimit(0, null, true));

    // Show the selected image after init
    this.showTab(0);
  },

  data() {
    return {
      filter: Filter.createDefaultFilter(),
      images: [],
      activeTabIdx: 0,
      selectedImageCount: 0,
      unselectedImageCount: 0,
      showSnackbar: false,
      message: '',
      themeDark: true,
      clipped: false,
      drawer: true,
      fixed: false,
      title: '',
    };
  },

  methods: {
    onFilterChange: function() {
      this.showTab(0);
      this.activeTabIdx = 0;
    },

    onImageClicked: function(event) {
      let imageId = event;
      let image = this.session.allImages.find(x => x.id == imageId);

      if (image == null) {
        this.showMessage(`Image: ${imageId} not found`);
      }

      if (this.activeTabIdx == 0) {
        // on Selected tab
        this.session.addUnLikeImages(image);
        this.showMessage(`Moved image: ${imageId} to Unselected tab.`);
      } else {
        this.session.addLikeImages(image);
        this.showMessage(`Added image: ${imageId} to Selected tab.`);
      }
      this.showTab(this.activeTabIdx);
    },

    showTab: function(tabIdx) {
      if (tabIdx == 0) {
        // The selected tab
        let filteredImages = this.filter.filter(this.session.allImages);
        let imageData = this.session.getSelectedImages(filteredImages);
        this.images = imageData.images;
        this.selectedImageCount = imageData.selectedCount;
        this.unselectedImageCount = imageData.unselectedCount;
      } else {
        let filteredImages = this.filter.filter(this.session.allImages);
        let imageData = this.session.getUnSelectedImages(filteredImages);
        this.images = imageData.images;
        this.selectedImageCount = imageData.selectedCount;
        this.unselectedImageCount = imageData.unselectedCount;
      }
    },

    saveImages: function() {
      // Init Downloader
      let downloadFolder = toValidFileName(this.title) + '/';

      chrome.downloads.onDeterminingFilename.addListener(function(item, suggest) {
        let filePath = downloadFolder + item.filename;
        suggest({
          filename: filePath,
          conflictAction: 'uniquify',
        });
      });

      this.showMessage('Saving ' + this.images.length + ' images to ' + downloadFolder);

      this.images.forEach(img => {
        let imageFullName = img.fileName + '.' + img.type;
        console.log('Saving image ' + imageFullName + ' to ' + downloadFolder + ' from: ' + img.src);
        chrome.downloads.download(
          {
            url: img.src,
            filename: imageFullName,
            saveAs: false,
            conflictAction: 'uniquify',
          },
          function(downloadId) {}
        );
      });
    },

    showMessage: function(message) {
      this.message = message;
      this.showSnackbar = true;
    },
  },
};
</script>
<style>
#fileNameBox {
  margin-left: 30px;
}
</style>
