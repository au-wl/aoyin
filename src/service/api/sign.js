/**
 * sign模块接口列表
 */

import base from '../base'; // 导入接口域名列表
import axios from '../http'; // 导入http中创建的axios实例

const sign = {
  getAccInfo() {
    return axios.get(`${base.yunc2c}/member/getmember`);
  },
  // 登录(post提交)
  login(data) {
  // console.log(qs.stringify(data));
    return axios.post(`${base.yunc2c}/member/login`, data);
  },
  // 微信登录
  wxLogin(data) {
    return axios.post(`${base.yunc2c}/member/authlogin`, data);
  },
  // 退出登录(get提交)
  loginOut() {
    return axios.get(`${base.yunc2c}/member/logout`);
  },
  // 获取验证码
  verifyCode(params) {
    return axios.get(`${base.yunc2c}/member/sendmsg/${params.phoneNum}`);
  },
  // 检验验证码
  ckVerifyCode(params) {
    return axios.get(`${base.yunc2c}/member/validmsgcode/${params.phoneNum}/${params.verifyCode}`);
  },
  // 注册
  register(data) {
    return axios.post(`${base.yunc2c}/member/register`, data);
  },
  // 设置资金密码
  setFundPwd(data) {
    return axios.post(`${base.yunc2c}/member/secpwdset`, data);
  },
  // 设置资金密码(微信)
  setFundPwdnp(data) {
    return axios.post(`${base.yunc2c}/member/wxsecpwdset`, data);
  },
  // 重置资金密码(微信)
  upFundPwdnp(data) {
    return axios.post(`${base.yunc2c}/member/wxsecpwdreset`, data);
  },
  // 设置登录密码
  setLoginPwd(data) {
    return axios.post(`${base.yunc2c}/member/pwd/retrieve`, data);
  }
};

// export const apiAddress = p => post('api/v1/users/my_address/address_edit_before', p);

export default sign;
