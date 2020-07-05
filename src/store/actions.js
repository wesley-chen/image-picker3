import * as types from "./mutation-types";

export const addImages = ({ commit }, payload) => {
  commit(types.ADD_IMAGES, payload);
};
