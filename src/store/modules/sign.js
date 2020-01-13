/**
 * 用户权限相关模块
 * */
import api from '@/service/api';
import { ERR_OK } from '@/service/base';
import { Toast } from 'vant';
import { setCache, getCache, removeCache } from '@/utils/loclstore';

const sign = {
  namespaced: true,
  state: {
    token: getCache('token', true) || '',
    userInfo: getCache('userInfo', true) || {}
  },
  getters: {
    // !!将state.token强制转换为布尔值，若state.token存在且不为空(已登录)则返回true，反之返回false
    isLogined: (state) => {
      return !!state.token;
    }
  },
  mutations: {
    auth_success(state, data) {
      state.token = data.token;
      state.userInfo = data;
    },
    auth_faild(state) {
      state.token = '';
    },
    acc_data(state, userInfo) {
      state.userInfo = userInfo;
    }
  },
  actions: {
    UpdateAccData({ commit }) {
      api.sign.getAccInfo().then(res => {
        let data = res.data;
        if (data.status === ERR_OK) {
          let result = data.result;
          const token = result.token;
          const userInfo = result;
          setCache('token', token);
          setCache('userInfo', userInfo);
          commit('auth_success', result);
        };
      });
    },
    Login({ commit }, user) {
      return new Promise((resolve, reject) => {
        // 向后端发送请求，验证用户名密码是否正确，请求成功接收后端返回的token值，利用commit修改store的state属性，并将token存放在localStorage中
        api.sign.login(user).then(res => {
          let data = res.data;
          if (data.status === ERR_OK) {
            Toast('登录成功');
            let result = data.result;
            // 更新token
            const token = result.token;
            const userInfo = result;
            setCache('token', token);
            setCache('userInfo', userInfo);
            commit('auth_success', result);
            resolve(res);
          };
        }).catch(err => {
          removeCache('token');
          commit('auth_faild');
          reject(err);
        });
      });
    },
    WxLogin({ commit }, user) {
      return new Promise((resolve, reject) => {
        // 向后端发送请求，验证用户名密码是否正确，请求成功接收后端返回的token值，利用commit修改store的state属性，并将token存放在localStorage中
        api.sign.wxLogin(user).then(res => {
          let data = res.data;
          if (data.status === ERR_OK) {
            Toast('登录成功');
            let result = data.result;
            // 更新token
            const token = result.token;
            const userInfo = result;
            setCache('token', token);
            setCache('userInfo', userInfo);
            commit('auth_success', result);
            resolve(res);
          };
        }).catch(err => {
          removeCache('token');
          commit('auth_faild');
          reject(err);
        });
      });
    },
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        api.sign.loginOut().then(res => {
          removeCache('token');
          commit('auth_faild');
          resolve(res);
        }).catch(error => {
          commit('auth_faild');
          removeCache('token');
          reject(error);
        });
      });
    },
    ChangeIsLogined({ commit, state }) {
      state.token = '';
      removeCache('token');
      commit('auth_faild');
    }
  }
};

export default sign;
