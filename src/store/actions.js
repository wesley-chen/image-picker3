import * as types from './mutation-types';

export const setFoo = ({ commit }, payload) => {
  commit(types.UPDATE_FOO, payload);
};

export const addImages = ({ commit }, payload) => {
  commit(types.ADD_IMAGES, payload);
};
