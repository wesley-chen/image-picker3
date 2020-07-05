<template>
  <v-app persistent>
    <v-navigation-drawer app clipped v-model="showDrawer">
      <FilterPanel :filter="filter" v-on:filter-change="onFilterChange" />
    </v-navigation-drawer>

    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click.stop="showDrawer = !showDrawer"></v-app-bar-nav-icon>

      <v-spacer></v-spacer>

      <v-btn icon @click.stop="changeTheme">
        <v-icon>mdi-invert-colors</v-icon>
      </v-btn>

      <v-menu bottom left absolute :close-on-content-click="false" v-model="showMenu">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <OptionPanel :settings="settings" v-on:setting-change="onSettingChange" />
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-subheader>Matched Images ({{ this.selectedImageCount }})</v-subheader>
      <v-divider></v-divider>
      <ImageGrid :images="selectedImages" v-on:image-clicked="onImageClicked" :settings="settings" />
      <v-subheader>Ignore Images ({{ this.unselectedImageCount }})</v-subheader>
      <v-divider></v-divider>
      <ImageGrid
        :images="unselectedImages"
        v-on:image-clicked="onImageClicked"
        :settings="settings"
      />
      <v-btn
        fab
        fixed
        bottom
        right
        color="primary"
        @click="saveImages()"
        v-show="activeTabIdx == 0"
      >
        <v-icon>mdi-file-download</v-icon>
      </v-btn>
      <v-snackbar v-model="showSnackbar" vertical top :timeout="2000">
        {{ message }}
        <v-btn color="pink" @click="undoSnackbarFunc">Undo</v-btn>
      </v-snackbar>
    </v-main>
    <v-footer app class="justify-center">
      <v-spacer></v-spacer>
      <span>Download to</span>
      <v-text-field id="fileNameBox" single-line v-model="title"></v-text-field>
      <v-spacer></v-spacer>
    </v-footer>
  </v-app>
</template>

<script>
import ImageGrid from "./ImageGrid";
import FilterPanel from "./FilterPanel";
import OptionPanel from "./OptionPanel";
import gSettingManager from "../model/setting";
import {
  getImageDomains,
  getImageTypes,
  toValidFileName,
  Filter,
  RangeLimit,
  ImageViewSession
} from "../model";

export default {
  name: "ImagePicker",

  session: null,
  filter: null,
  settings: null,

  components: {
    ImageGrid,
    FilterPanel,
    OptionPanel
  },

  created: function() {
    console.log(
      "Created ImagePicker with %d images",
      this.$store.state.images.length
    );
    this.title = this.$store.state.tabTitle;
    this.session = new ImageViewSession(
      this.$store.state.images,
      this.title,
      this.$store.state.tabUrl
    );

    // Load settings
    this.settings = gSettingManager.loadSettings((loadedSetting, hasUpdate) => {
      // init filter
      let allImages = this.session.allImages;
      let domainData = getImageDomains(allImages);
      let typeData = getImageTypes(allImages);
      let sizeLimit = new RangeLimit(this.settings.filter.sizeLimit);
      let widthLimit = new RangeLimit(this.settings.filter.widthLimit);
      let heightLimit = new RangeLimit(this.settings.filter.heightLimit);
      this.filter = new Filter(
        domainData,
        typeData,
        sizeLimit,
        widthLimit,
        heightLimit
      );

      this.$vuetify.theme.dark = this.settings.view.themeDark;
      this.showDrawer = !(this.settings.view.viewMode == "Percent100");

      // Show the selected image after init
      this.categorizeImages();
    });
  },

  data() {
    return {
      filter: Filter.createDefaultFilter(),
      settings: null,
      selectedImages: [],
      unselectedImages: [],
      activeTabIdx: 0,
      selectedImageCount: 0,
      unselectedImageCount: 0,
      showSnackbar: false,
      undoSnackbarFunc: function() {},
      showMenu: false,
      showDrawer: true,
      message: "",
      title: ""
    };
  },

  methods: {
    onFilterChange: function() {
      this.categorizeImages();
      this.activeTabIdx = 0;

      // Update settings
      this.filter.sizeLimit.copyTo(this.settings.filter.sizeLimit);
      this.filter.widthLimit.copyTo(this.settings.filter.widthLimit);
      this.filter.heightLimit.copyTo(this.settings.filter.heightLimit);

      this.saveSettings();
    },

    onSettingChange: function(changedSettingName) {
      this.saveSettings();
      if (changedSettingName == "viewMode") {
        this.showDrawer = !(this.settings.view.viewMode == "Percent100");
      }
    },

    onImageClicked: function(imageId, event) {
      let likeOps = this.settings.behavior.likeImage;
      if (likeOps == "CtrlClick" && !event.ctrlKey) {
        return;
      } else if (likeOps == "AltClick" && !event.altKey) {
        return;
      } else if (likeOps == "ShiftClick" && !event.shiftKey) {
        return;
      }

      let image = this.session.allImages.find(x => x.id == imageId);

      if (image == null) {
        this.showMessage(`Image: ${imageId} not found`);
      }

      if (image.like) {
        // on Selected tab
        this.session.addUnLikeImages(image);
        this.undoSnackbarFunc = () => {
          this.session.addLikeImages(image);
        };
        this.showMessage(`Igone image: ${image.fileFullName} for download.`);
      } else {
        this.session.addLikeImages(image);
        this.undoSnackbarFunc = () => {
          this.session.addUnLikeImages(image);
        };
        this.showMessage(
          `Like image: ${image.fileFullName}. It will be always selected for download.`
        );
      }
    },

    changeTheme: function() {
      this.settings.view.themeDark = !this.settings.view.themeDark;
      this.$vuetify.theme.dark = this.settings.view.themeDark;
      this.saveSettings();
    },

    saveSettings() {
      chrome.runtime.sendMessage({
        type: "SaveSettings",
        settings: this.settings
      });
    },

    categorizeImages: function() {
      let filteredImages = this.filter.filter(this.session.allImages);

      let imageData = this.session.getSelectedImages(filteredImages);
      this.selectedImages = imageData.images;
      this.selectedImageCount = imageData.selectedCount;

      imageData = this.session.getUnSelectedImages(filteredImages);
      this.unselectedImages = imageData.images;
      this.unselectedImageCount = imageData.unselectedCount;
    },

    saveImages: function() {
      this.categorizeImages();
      this.showMessage(
        "Saving " + this.selectedImageCount + " images to " + this.title
      );
      chrome.runtime.sendMessage({
        type: "BatchDownload",
        images: this.images,
        tabUrl: this.session.tabUrl,
        savedfolderName: this.title
      });
    },

    showMessage: function(message) {
      this.message = message;
      this.showSnackbar = true;
    }
  }
};
</script>
<style>
#fileNameBox {
  margin-left: 30px;
}
</style>
