import store from './store';
import gDownloader from './core/model/downloader';
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

chrome.runtime.onMessage.addListener(function(message, sender) {
  console.log('Received: %o', message);
  if (message.type == 'SingleDownload') {
    const img = message.image;
    const tabUrl = sender.tab.url;
    const tabTitle = sender.tab.title;

    // alert('Saving ' + img.src);

    gDownloader.init(tabTitle);
    console.log('Saving %s images to %s', img.src, gDownloader.downloadFolder);
    gDownloader.download([new Image(img)], tabUrl);
  }
});
