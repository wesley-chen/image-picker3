import * as types from './mutation-types';
import { Image } from "../core/model"

export default {
  [types.UPDATE_FOO](state, payload) {
    state.foo = payload;
  },

  [types.ADD_IMAGES](state, payload) {
    let imageList = payload.images.flatMap(img => new Image(img));
    state.images = imageList;
    state.title = payload.title;
  },
};
