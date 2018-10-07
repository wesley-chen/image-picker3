import Vue from 'vue'
import '../core/plugins/vuetify'
import App from './App';
import store from '../store';
import * as types from '../store/mutation-types';
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.config.productionTip = false

// Setup listener
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log("Received images: %d from %O", message.images.length, sender.tab);
  console.log("store.state=" + store.state);
  store.commit(types.ADD_IMAGES, message);
  console.log("Added images to store. image count: " + store.state.images.length);

  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    store,

    render: h => h(App),
  });

  console.log("Init the Image Picker app");
});

console.log('injecting content script ...');
chrome.tabs.getCurrent(function (tab) {

  chrome.tabs.executeScript(tab.openerTabId, {
    file: 'send_images.js',
    runAt: "document_end",
    allFrames: true
  });

  console.log("injected send_images.js");
});
