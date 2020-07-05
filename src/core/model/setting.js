class SettingManager {
  constructor() {
    this.settings = {
      view: {
        showImageName: true,
        showImageMeta: true,
        showImageUrl: true,
        viewMode: "Thumbnail", // Options: "Thumbnail", "FitWidth", "Percent100"
        thumbnailWidth: 240,
        themeDark: true
      },
      filter: {
        sizeLimit: { min: 20, max: null, includedUnknown: true },
        widthLimit: { min: 20, max: null, includedUnknown: true },
        heightLimit: { min: 20, max: null, includedUnknown: true }
      },
      behavior: {
        likeImage: "ClickOnly" // Options: "ClickOnly", "CtrlClick", "AltClick", "ShiftClick"
      },
      sinlgeDownload: {
        action: "ClickOnly", // Options: "ClickOnly", "CtrlClick", "AltClick", "ShiftClick", "Drag"
        createSubFolderByTitle: true,
        askLocationForNewTab: true, // It seems Chrome doesn't support Folder Picker!!!
        askLocationWhenDragLeft: true // It seems Chrome doesn't support Folder Picker!!!
      }
    };
  }

  loadSettings(callback) {
    // Load settings
    chrome.storage.sync.get(["ImagePickerSettings"], result => {
      if (result.ImagePickerSettings) {
        // Copy setting
        let chormeSettings = result.ImagePickerSettings;
        Object.assign(this.settings.view, chormeSettings.view);
        Object.assign(this.settings.filter, chormeSettings.filter);
        Object.assign(this.settings.behavior, chormeSettings.behavior);
        Object.assign(
          this.settings.sinlgeDownload,
          chormeSettings.sinlgeDownload
        );
        console.log("Loaded ImagePicker Settings: %o", this.settings);
        let hasUpdate = true;
        callback(this.settings, hasUpdate);
      } else {
        console.log("No ImagePicker Settings found. %o", result);
        let hasUpdate = false;
        callback(this.settings, hasUpdate);
      }
    });

    return this.settings;
  }

  save() {
    console.log("Saving ImagePicker Settings. %o", this.settings);
    chrome.storage.sync.set({ ImagePickerSettings: this.settings }, () => {
      console.log("Saved ImagePicker Settings.");
    });
  }

  saveSettings(newSettings) {
    this.settings = newSettings;
    this.save();
  }
}

const instance = new SettingManager(); // export as singleton object
export default instance;
