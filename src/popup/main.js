import Vue from "vue";
import App from "./App.vue";
import store from "../store";
import * as types from "../store/mutation-types";
import vuetify from "../plugins/vuetify";
import "@babel/polyfill";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";

Vue.config.productionTip = false;

// Setup listener
let gOpenerTabTabId = ""; // the tab that open this popup.

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  // Only process the message that sent from the opener tab
  if (sender.tab.id == gOpenerTabTabId && message.type == "ViewImages") {
    const receivedImages = message.images;
    const tabUrl = sender.tab.url;
    const tabTitle = sender.tab.title;
    const payload = {
      images: receivedImages,
      tabTitle,
      tabUrl
    };

    console.log(
      "Received images: %d from the tab %O",
      receivedImages.length,
      tabTitle
    );
    store.commit(types.ADD_IMAGES, payload);
    console.log(
      "Added %d images to store. Total image count: %d",
      receivedImages.length,
      store.state.images.length
    );

    /* eslint-disable no-new */
    new Vue({
      el: "#app",
      vuetify,
      store,

      render: h => h(App)
    });

    console.log("Init Image Picker app");
  }
});

chrome.tabs.getCurrent(function(tab) {
  // listen to current tab message only
  gOpenerTabTabId = tab.openerTabId;

  console.log("Send message to image_collector.js to start collect images.");
  chrome.tabs.sendMessage(gOpenerTabTabId, {
    type: "CollectAllImages"
  });
});
