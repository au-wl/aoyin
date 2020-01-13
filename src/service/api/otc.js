/**
 * otc模块接口列表
 */

import base from '../base'; // 导入接口域名列表
import axios from '../http'; // 导入http中创建的axios实例

const otc = {
  /**
   * 获取otc列表
   * @param {Object} params
   * /币种/买卖方向/当前第几页/一页多少条
   */
  otcList(params) {
    return axios.get(`${base.yunc2c}/otc/advertise/getadvertiselist/${params.currency}/${params.transDirection}/${params.currPage}/${params.pageSize}`);
  },
  /**
   * 获取场外USDT交易Info
   * @param {Object} params
   * 币种/法币币种
   */
  exInfo(params) {
    return axios.get(`${base.yunc2c}/otc/order/outsideprice/${params.currency}/${params.legalCurrency}`);
  },
  /**
   * 获取当前币种OTC余额
   * @param {Object} params
   * 币种
   */
  otcAvailableByCurrecy(params) {
    return axios.get(`${base.yunc2c}/wealth/countbalance/${params.currency}`);
  },
  // 下单 (post提交)
  deal(data) {
    return axios.post(`${base.yunc2c}/otc/order/addorder`, data);
  },
  // 外部下单
  gameDeal(data) {
    return axios.post(`${base.yunc2c}/gm/gamempconfirmpay`, data);
  }
  // 其他接口…………
};

// export const apiAddress = p => post('api/v1/users/my_address/address_edit_before', p);

export default otc;
