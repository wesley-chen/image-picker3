<template>
  <OptionPanel :settings="settings" v-on:setting-change="onSettingChange" />
</template>

<script>
import OptionPanel from "../core/components/OptionPanel";
import gSettingManager from "../core/model/setting";

export default {
  name: "App",

  components: {
    OptionPanel
  },
  created: function() {
    console.log("Created ImagePicker Options page");
    // Load settings
    this.settings = gSettingManager.loadSettings(
      (loadedSetting, hasUpdate) => {}
    );
  },

  data() {
    return {
      settings: null
    };
  },

  methods: {
    onSettingChange: function(changedSettingName) {
      gSettingManager.saveSettings();
    }
  }
};
</script>
