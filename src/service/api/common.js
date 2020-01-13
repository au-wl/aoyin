/**
 * order模块接口列表
 */

import base from '../base'; // 导入接口域名列表
import axios from '../http'; // 导入http中创建的axios实例

const common = {
  /**
   * 上传图片
   * @param {Object} params
   */
  uploadImage(data) {
    return axios.post(`${base.yunc2c}/common/fileupload`, data);
  },
  /**
   * 保存图片
   * @param {Object} params
   */
  saveImage(data) {
    return axios.post(`${base.yunc2c}/otc/order/uploadpayauth`, data);
  },
  configInfo() {
    return axios.get(`${base.yunc2c}/common/config`);
  }
  // 其他接口…………
};

// export const apiAddress = p => post('api/v1/users/my_address/address_edit_before', p);

export default common;
