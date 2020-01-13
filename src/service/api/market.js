/**
 * market模块接口列表
 */

import base from '../base'; // 导入接口域名列表
import axios from '../http'; // 导入http中创建的axios实例
import qs from 'qs'; // 根据需求是否导入qs模块
import * as utils from '@/utils/utils';

const market = {
  /**
   * 获取banner图
   * @param {Object} params
   * 时间戳
   */
  getBanner() {
    let timestamp = utils.dateTime.newDate().getTime();
    return axios.get(`${base.yunc2c}/news/banner/1/1/10/${timestamp}`);
  },
  /**
   * 获取场外MP交易Info
   * @param {Object} params
   */
  currencyInfo() {
    return axios.get(`${base.yunc2c}/otc/order/getquicktrans`);
  },
  // post提交
  login(params) {
    return axios.post(`${base.yunc2c}/accesstoken`, qs.stringify(params));
  }
  // 其他接口…………
};

// export const apiAddress = p => post('api/v1/users/my_address/address_edit_before', p);

export default market;
