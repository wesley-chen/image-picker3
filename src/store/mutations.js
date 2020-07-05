import * as types from "./mutation-types";
import { Image } from "../core/model";

export default {
  [types.ADD_IMAGES](state, payload) {
    let imageList = payload.images.flatMap(img => new Image(img));
    state.images.push(...imageList);
    state.tabTitle = payload.tabTitle;
    state.tabUrl = payload.tabUrl;
  }
};
