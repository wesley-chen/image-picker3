class SettingManager {
  constructor() {
    this.settings = {
      view: {
        showImageName: true,
        showImageMeta: true,
        showImageUrl: true,
        viewMode: 'Thumbnail', // Options: "Thumbnail", "FitWidth", "Percent100"
        thumbnailWidth: 240,
        themeDark: true,
      },
      filter: {
        sizeLimit: { min: 20, max: null, includedUnknown: true },
        widthLimit: { min: 20, max: null, includedUnknown: true },
        heightLimit: { min: 20, max: null, includedUnknown: true },
      },
      behavior: {
        likeImage: 'ClickOnly', // Options: "ClickOnly", "CtrlClick", "AltClick", "ShiftClick"
      },
    };
  }

  loadSettings(callback) {
    // Load settings
    chrome.storage.sync.get(['ImagePickerSettings'], result => {
      if (result.ImagePickerSettings) {
        // Copy setting
        let chormeSettings = result.ImagePickerSettings;
        Object.assign(this.settings.view, chormeSettings.view);
        Object.assign(this.settings.filter, chormeSettings.filter);
        Object.assign(this.settings.behavior, chormeSettings.behavior);
        console.log('Loaded ImagePicker Settings: %o', this.settings);
        let hasUpdate = true;
        callback(this.settings, hasUpdate);
      } else {
        console.log('No ImagePicker Settings found. %o', result);
        let hasUpdate = false;
        callback(this.settings, hasUpdate);
      }
    });

    return this.settings;
  }

  saveSettings() {
    console.log('Saving ImagePicker Settings. %o', this.settings);
    chrome.storage.sync.set({ ImagePickerSettings: this.settings }, () => {
      console.log('Saved ImagePicker Settings.');
    });
  }
}

const instance = new SettingManager(); // export as singleton object
export default instance;
