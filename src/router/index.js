import Vue from 'vue';
import Router from 'vue-router';
import Main from '@/layouts/main';

import otcModules from './modules/otc';
import signModules from './modules/sign';
import myModules from './modules/my';
import otherModules from './modules/other';
import orderModules from './modules/order';

Vue.use(Router);

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'login',
      meta: {
        title: '登录'
      },
      component: () => import('@/views/sign/login')
    },
    {
      path: '/wxLogin',
      name: 'wxLogin',
      meta: {
        title: '微信登录'
      },
      component: () => import('@/views/sign/login_wx')
    },
    {
      path: '/register',
      name: 'register',
      meta: {
        title: '注册'
      },
      component: () => import('@/views/sign/register')
    },
    {
      path: '/',
      name: 'main',
      redirect: 'market', /* 子路由默认加载第一个界面 */
      component: Main,
      children: [ /* 子路由 */
        {
          path: '/market',
          name: 'market',
          meta: {
            title: '首页',
            icon: 'iconfont iconfont iconzichan'
          },
          component: () => import('@/views/main/market')
        },
        /* {
          path: '/otc',
          name: 'otc',
          meta: {
            title: 'OTC',
            icon: 'iconfont iconfont iconotc'
          },
          component: () => import('@/views/main/otc')
        }, */
        /* {
          path: '/wallet',
          name: 'wallet',
          meta: {
            title: '钱包',
            icon: 'iconfont iconfont iconwallet'
          },
          component: () => import('@/views/main/wallet')
        }, */
        {
          path: '/my',
          name: 'my',
          meta: {
            title: '我的',
            icon: 'iconfont iconfont iconmy'
          },
          component: () => import('@/views/main/my')
        }
      ]
    },
    ...signModules,
    ...otcModules,
    ...myModules,
    ...otherModules,
    ...orderModules
  ]
});

// 需要左方向动画的路由用this.$router.to('****')
Router.prototype.togo = function(path) {
  this.isleft = true;
  this.isright = false;
  this.push(path);
};
// 需要右方向动画的路由用this.$router.goRight('****')
Router.prototype.goRight = function(path) {
  this.isright = true;
  this.isleft = false;
  this.push(path);
};
// 需要返回按钮动画的路由用this.$router.goBack()，返回上一个路由
Router.prototype.goBack = function(backIndex) {
  this.isright = true;
  this.isleft = false;
  if(backIndex) {
    this.go(backIndex);
  } else {
    this.go(-1);
  }
};
// 点击浏览器返回按钮执行，此时不需要路由回退
Router.prototype.togoback = function() {
  this.isright = true;
  this.isleft = false;
};
// 点击浏览器前进按钮执行
Router.prototype.togoin = function() {
  this.isright = false;
  this.isleft = true;
};
Router.prototype.toLogin = function(to, back) {
  // console.log(this);
  // console.log(this.currentRoute.fullPath);
  if (back) {
    this.replace({
      path: to,
      query: {
        redirect: back
      }
    });
  } else {
    this.goBack();
  }
};
