import store from 'store';
const STORE_KEY = 'setting';
/**
 * @description 获取组件的this层缓存
 * @param {store_key} 缓存的key
 * @param {that} 数据层的作用域(组件实例)
 * @param {dele} 是否删除缓存(默认删除)
 * */
export const getStore = (that, store_key = STORE_KEY, dele) => {
  console.log('本地缓存---------', store.get(store_key));
  var loacls = store.get(store_key);
  if (loacls && loacls !== 'undefined') {
    // 改变整个数据层
    for (let key in loacls) {
      that.$set(that, key, loacls[key]);
    }
    // 使用缓存之后立即清除缓存
    if (!dele) store.remove(store_key);
  }
  return loacls;
};
/**
 * @description 设置组件的this层缓存
 * @param {store_key} 缓存的key
 * @param {that} 数据层的作用域(组件实例)
 * */
export const setStore = (that, store_key = STORE_KEY) => {
  // 缓存整个数据层
  store.set(store_key, that._data);
};

/**
 * @description 根据key设置单个缓存
 * @param {store_key} 缓存的key
 * @param {data} 缓存数据
 * */
export const setCache = (store_key = STORE_KEY, data) => {
  store.set(store_key, data);
};
/**
 * @description 根据key获取单个缓存
 * @param {store_key} 缓存的key
 * @param {dele}  是否删除缓存(默认删除)
 * */
export const getCache = (store_key = STORE_KEY, dele) => {
  var data = store.get(store_key);
  if (!dele) {
    // 使用缓存之后立即清除缓存
    store.remove(store_key);
  }
  return data;
};

export const removeCache = (store_key = STORE_KEY, dele) => {
  // 清除缓存
  store.remove(store_key);
};
