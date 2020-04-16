import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    data: JSON.parse(localStorage.getItem('YACEP_EMO_DATA') || '[]'),
  },
});
