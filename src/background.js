import store from './store';
import gDownloader from './core/model/downloader';
import gSettingManager from './core/model/setting';
import { Image } from './core/model';

alert(`Hello ${store.getters.title}!`);

console.log('ImagePicker started.');

// Called when the user clicks on the browser action icon.
chrome.browserAction.onClicked.addListener(function(tab) {
  // Open ImagePicker UI
  var imagepicker_url = chrome.extension.getURL('popup/popup.html');
  chrome.tabs.create({
    url: imagepicker_url,
    openerTabId: tab.id,
  });
});

// const gSavedTabUrls = [];
chrome.runtime.onMessage.addListener(function(message, sender) {
  console.log('Received: %o', message);
  if (message.type == 'SingleDownload') {
    const img = message.image;
    const tabUrl = sender.tab.url;
    const tabTitle = sender.tab.title;
    const event = img.event;
    const xDiff = event.toX - event.fromX;
    const yDiff = event.toY - event.fromY;
    const isDrag = xDiff != 0 && yDiff != 0;

    let needSave = false;
    // Load setting
    const gSettings = gSettingManager.loadSettings((loadedSetting, hasUpdate) => {});
    const action = gSettings.sinlgeDownload.action;
    if (action == 'CtrlClick' && event.ctrlKey && event.click) {
      needSave = true;
    } else if (action == 'ShiftClick' && event.shiftKey && event.click) {
      needSave = true;
    } else if (action == 'AltClick' && event.altKey && event.click) {
      needSave = true;
    } else if (action == 'ClickOnly' && event.click) {
      needSave = true;
    } else if (action == 'Drag' && isDrag) {
      needSave = true;
    }
    //alert('Saving ' + action + " needSave=" + needSave);

    // It seems Chrome doesn't support Folder Picker!!!
    // const isDragLeft = (xDiff < 0)
    // let isNewTab = !gSavedTabUrls.includes(tabUrl);
    // let askLocation = (gSettings.sinlgeDownload.location == ""); // no location
    // askLocation = askLocation || (isDragLeft && gSettings.sinlgeDownload.askLocationWhenDragLeft);
    // askLocation = askLocation || (isNewTab && gSettings.sinlgeDownload.askLocationForNewTab);
    // gSavedTabUrls.push(tabUrl);
    // alert('Saving ' + img.src);
    if (needSave) {
      const folderName = gSettings.sinlgeDownload.createSubFolderByTitle ? tabTitle : '';
      gDownloader.init(folderName);
      console.log('Saving %o images to %s', img, gDownloader.downloadFolder);
      gDownloader.download([new Image(img)], tabUrl);
    }
  }
});
