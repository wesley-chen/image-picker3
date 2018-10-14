import Vue from 'vue';
import '../core/plugins/vuetify';
import App from './App';
import store from '../store';
import * as types from '../store/mutation-types';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

Vue.config.productionTip = false;

// Setup listener
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  const receivedImages = message.images;
  const tabUrl = sender.tab.url;
  const tabTitle = sender.tab.title;
  const payload = {
    images: receivedImages,
    tabTitle,
    tabUrl,
  };

  console.log('Received images: %d from the tab %O', receivedImages.length, tabTitle);
  store.commit(types.ADD_IMAGES, payload);
  console.log('Added %d images to store. Total image count: %d', receivedImages.length, store.state.images.length);

  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    store,

    render: h => h(App),
  });

  console.log('Init Image Picker app');
});

console.log('Injecting content script ...');
chrome.tabs.getCurrent(function(tab) {
  chrome.tabs.executeScript(tab.openerTabId, {
    file: 'send_images.js',
    runAt: 'document_end',
    allFrames: true,
  });

  console.log('Injected send_images.js');
});
