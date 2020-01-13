/**
 * my模块接口列表
 */

import base from '../base'; // 导入接口域名列表
import axios from '../http'; // 导入http中创建的axios实例
import qs from 'qs'; // 根据需求是否导入qs模块

const my = {
  // 邀请好友模块
  /**
   * 获取我的推荐列表
   * @param {Object} params
   * 当前页/页面大小
   */
  recommendlList(params) {
    return axios.get(`${base.yunc2c}/wealth/relevelcount/${params.currPage}/${params.pageSize}`);
  },
  /**
   * 绑定邀请码
   * @param {Object} params
   * 邀请码
   */
  bindCode(params) {
    return axios.get(`${base.yunc2c}/member/bindcode/${params.inviteCode}`);
  },
  /**
   * 获取分享图片
   */
  inviteImg() {
    return axios.get(`${base.yunc2c}/member/qcode`);
  },
  /**
   * 修改用户名 (post请求)
   * @param {Object} data
   */
  updataNickname(data) {
    return axios.post(`${base.yunc2c}/member/updnickname`, data);
  }
  // 其他接口…………
};

// export const apiAddress = p => post('api/v1/users/my_address/address_edit_before', p);

export default my;
