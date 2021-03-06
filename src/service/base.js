/**
 * 接口域名的管理
 */
// 请求成功返回状态，字段和后台统一
export const ERR_OK = 1;

// 验证码倒计时
export const VerifySendTimeout = 60;

// 域名
// export const DomainUrl = 'http://www.icmg.me';
export const DomainUrl = 'http://www.kiwicoin.vip';

// 图片域名
// export const ImageUrl = 'http://img.icmg.me';
export const ImageUrl = 'http://image.zhdt.online';
// 微信授权
export let WxAuthConfig = {
  authUrl: 'https://open.weixin.qq.com/connect/oauth2/authorize',
  wxAuthCodeUrl: 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECTURL&response_type=code&scope=snsapi_userinfo&state=TIMESTAMP&connect_redirect=1#wechat_redirect',
  appid: 'wx3fe51b574c4fc7d8'
}

let base = {};

console.log(process.env.NODE_ENV);

// 环境的切换
if (process.env.NODE_ENV === 'development') {
  base = {
    yunc2c: 'http://localhost:8081/yunc2c',
    domainUrl: 'http://localhost:8081',
    // imageUrl: 'http://img.icmg.me'
    imageUrl: 'http://image.zhdt.online'
  };
} else if (process.env.NODE_ENV === 'debug') {
  base = {
    yunc2c: 'http://localhost:8081/yunc2c',
    domainUrl: 'http://localhost:8081',
    // imageUrl: 'http://img.icmg.me'
    imageUrl: 'http://image.zhdt.online'
  };
} else if (process.env.NODE_ENV === 'production') {
  base = {
    yunc2c: 'http://www.kiwicoin.vip/yunc2c',
    domainUrl: 'http://www.kiwicoin.vip',
    // imageUrl: 'http://img.icmg.me'
    imageUrl: 'http://image.zhdt.online'
  };
}

export default base;
