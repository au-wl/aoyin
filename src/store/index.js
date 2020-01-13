import Vue from 'vue';
import Vuex from 'vuex';

import common from './modules/common';
import sign from './modules/sign';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    common: common,
    sign: sign
  },
  state: {
    LOADING: false
  },
  mutations: {
    showLoading(state) {
      state.LOADING = true;
    },
    hideLoading(state) {
      state.LOADING = false;
    }
  }
});
