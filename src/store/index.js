import Vue from 'vue';
import Vuex from 'vuex';

import * as getters from './getters';
import mutations from './mutations';
import * as actions from './actions';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    title: 'Image Picker v3',
    tabUrl: '',
    images: [],
  },
  getters,
  mutations,
  actions,
});
