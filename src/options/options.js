import Vue from 'vue';
import App from './App';
import router from './router';
import vuetify from '../plugin/vuetify';
import axios from 'axios';

global.browser = require('webextension-polyfill');

Vue.prototype.$http = axios;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  vuetify,
  render: h => h(App),
});
