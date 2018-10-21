<template>
  <v-app persistent :dark="settings.view.themeDark">
    <v-navigation-drawer persistent enable-resize-watcher fixed app v-model="showDrawer">
      <FilterPanel :filter="filter" v-on:filter-change="onFilterChange"/>
    </v-navigation-drawer>
    <v-toolbar app :clipped-left="false">
      <v-btn icon @click.stop="showDrawer = !showDrawer">
        <v-icon v-html="showDrawer ?  'chevron_left': 'chevron_right'"></v-icon>
      </v-btn>
      <v-tabs v-model="activeTabIdx" centered slider-color="yellow" color="transparent">
        <v-tab @click="showTab(0)">
          Selected
          <span>({{this.selectedImageCount}})</span>
        </v-tab>
        <v-tab @click="showTab(1)">
          UnSelected
          <span>({{this.unselectedImageCount}})</span>
        </v-tab>
      </v-tabs>
      <v-spacer></v-spacer>
      <v-btn icon @click.stop="changeTheme">
        <v-icon>invert_colors</v-icon>
      </v-btn>
      <v-menu bottom left absolute :close-on-content-click="false" v-model="showMenu">
        <v-btn icon slot="activator">
          <v-icon>menu</v-icon>
        </v-btn>
        <OptionPanel :settings="settings" v-on:setting-change="onSettingChange"/>
      </v-menu>
    </v-toolbar>
    <v-content>
      <ImageGrid :images="images" v-on:image-clicked="onImageClicked" :settings="settings"/>
      <v-btn
        fab
        fixed
        bottom
        right
        color="primary"
        @click="saveImages()"
        v-show="activeTabIdx == 0"
      >
        <v-icon>cloud_download</v-icon>
      </v-btn>
      <v-snackbar v-model="showSnackbar" top right>
        {{ message }}
        <v-btn color="pink" flat @click="showSnackbar = false">Close</v-btn>
      </v-snackbar>
    </v-content>
    <v-footer app class="justify-center">
      <v-spacer></v-spacer>
      <span>Download to</span>
      <v-text-field id="fileNameBox" single-line :value="title"></v-text-field>
      <v-spacer></v-spacer>
    </v-footer>
  </v-app>
</template>

<script>
import ImageGrid from './ImageGrid';
import FilterPanel from './FilterPanel';
import OptionPanel from './OptionPanel';
import gDownloader from '../model/downloader';
import gSettingManager from '../model/setting';
import { getImageDomains, getImageTypes, toValidFileName, Filter, RangeLimit, ImageViewSession } from '../model';

export default {
  name: 'ImagePicker',

  session: null,
  filter: null,
  settings: null,

  components: {
    ImageGrid,
    FilterPanel,
    OptionPanel,
  },

  created: function() {
    console.log('Created ImagePicker with %d images', this.$store.state.images.length);
    this.title = this.$store.state.tabTitle;
    this.session = new ImageViewSession(this.$store.state.images, this.title, this.$store.state.tabUrl);

    // Load settings
    this.settings = gSettingManager.loadSettings((loadedSetting, hasUpdate) => {
      // init filter
      let allImages = this.session.allImages;
      let domainData = getImageDomains(allImages);
      let typeData = getImageTypes(allImages);
      let sizeLimit = new RangeLimit(this.settings.filter.sizeLimit);
      let widthLimit = new RangeLimit(this.settings.filter.widthLimit);
      let heightLimit = new RangeLimit(this.settings.filter.heightLimit);
      this.filter = new Filter(domainData, typeData, sizeLimit, widthLimit, heightLimit);

      this.showDrawer = !(this.settings.view.viewMode == 'Percent100');

      // Show the selected image after init
      this.showTab(0);
    });

    gDownloader.init(this.title);
  },

  data() {
    return {
      filter: Filter.createDefaultFilter(),
      settings: null,
      images: [],
      activeTabIdx: 0,
      selectedImageCount: 0,
      unselectedImageCount: 0,
      showSnackbar: false,
      showMenu: false,
      showDrawer: true,
      message: '',
      title: '',
    };
  },

  methods: {
    onFilterChange: function() {
      this.showTab(0);
      this.activeTabIdx = 0;

      // Update settings
      this.filter.sizeLimit.copyTo(this.settings.filter.sizeLimit);
      this.filter.widthLimit.copyTo(this.settings.filter.widthLimit);
      this.filter.heightLimit.copyTo(this.settings.filter.heightLimit);

      gSettingManager.saveSettings();
    },

    onSettingChange: function(changedSettingName) {
      gSettingManager.saveSettings();
      if (changedSettingName == 'viewMode') {
        this.showDrawer = !(this.settings.view.viewMode == 'Percent100');
      }
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
        this.showMessage(`Moved image: ${image.fileFullName} to Unselected tab.`);
      } else {
        this.session.addLikeImages(image);
        this.showMessage(`Added image: ${image.fileFullName} to Selected tab.`);
      }
      this.showTab(this.activeTabIdx);
    },

    changeTheme: function() {
      this.settings.view.themeDark = !this.settings.view.themeDark;
      gSettingManager.saveSettings();
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
      this.showMessage('Saving %d images to %s', this.images.length, gDownloader.downloadFolder);
      gDownloader.download(this.images, this.session.tabUrl);
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
