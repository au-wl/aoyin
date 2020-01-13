/**
 * order模块接口列表
 */

import base from '../base'; // 导入接口域名列表
import axios from '../http'; // 导入http中创建的axios实例

const order = {
  /**
   * 获取order列表
   * @param {Object} params
   * /订单状态/当前第几页/一页多少条
   */
  orderList(params) {
    return axios.get(`${base.yunc2c}/otc/order/getmyorder/${params.orderStatusDirection}/${params.currPage}/${params.pageSize}`);
  },
  /**
   * 获取订单详情
   * @param {Object} params
   * 订单id
   */
  orderInfo(params) {
    return axios.get(`${base.yunc2c}/otc/order/getorderinfo/${params.id}`);
  },
  /**
   * 获取外部订单详情
   * @param {Object} params
   * 订单id
   */
  gameOrderInfo(params) {
    return axios.get(`${base.yunc2c}/gm/gamerealorder/${params.gameOrderNo}/${params.mchid}/${params.appid}`);
  },
  // post提交
  confirmOrder(data) {
    return axios.post(`${base.yunc2c}/otc/order/confirmorder`, data);
  }
  // 其他接口…………
};

// export const apiAddress = p => post('api/v1/users/my_address/address_edit_before', p);

export default order;
