import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import router from '@/router';
import store from '@/store';
import api from '@/service/api';
import VueI18n from 'vue-i18n';
import $ from 'jquery';
import VueLazyLoad from 'vue-lazyload';

Vue.use(VueI18n);
Vue.use(VueLazyLoad);

Vue.config.productionTip = false;
Vue.prototype.$api = api;
Vue.prototype.JQ = $;


const i18n = new VueI18n({
  locale: 'zh', // 语言标识
  // this.$i18n.locale // 通过切换locale的值来实现语言切换
  messages: {
    'zh': require('@/assets/lang/zh'), // 中文语言包
    'en': require('@/assets/lang/en') // 英文语言包
  }
});

router.beforeEach((to, from, next) => {
  // console.log(to);
  if (to.meta.requireAuth) {
    if (store.state.sign.token) {
      next();
    } else {
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        }
      });
    }
  } else {
    next();
  }
});

window.vm = new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app');
