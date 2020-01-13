import { Toast } from 'vant';
import router from '@/router';

// toast弹窗
export const say = (msg, duration) => {
  if (msg) {
    Toast({
      message: msg || '',
      duration: duration || 2000
    });
    if (duration && duration > 0) {
      router.goBack();
    };
  };
};

// 获取页面传递对象的值
export const getParam = (name) => {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
};

// 获取页面所有的传参,返回object
export const getURLParams = (url = location.href) => {
  if (window.location.search) {
    return url.match(/([^?=&]+)(=([^&]*))/g)
      .reduce((a, v) => (a[v.slice(0, v.indexOf('='))] = v.slice(v.indexOf('=') + 1), a), {});
  } else {
    return null;
  }
};

// 用*隐藏信息 (例: 默认的 => 默*的)
export const hidePart = (val, header, footer, len) => {
  let starNum = '';
  if (arguments.length === 1) {
    header = 1;
    footer = 1;
    len = 1;
  }
  for (let i = 1; i <= len; i++) {
    starNum += '*';
  }
  let reg = new RegExp('^(\\S{' + header + '})\\S+(\\S{' + footer + '})$');
  return val.replace(reg, '$1' + starNum + '$2');
};

export const byteLen = (str) => {
  let len = 0;
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 127 || str.charCodeAt(i) === 94) {
      len += 2;
    } else {
      len++;
    }
  }
  return len;
};

// 格式化时间
export const dateTime = {
  newDate(date) {
    if (date instanceof Date) {
      return date;
    } else if (typeof (date) === 'string') {
      return new Date(date.replace(/-/gi, '/'));
    } else {
      return date ? new Date(date) : new Date();
    }
  },
  getTime() {
    return new Date().getTime();
  },
  now() {
    return this.format('yyyy-MM-dd hh:mm:ss');
  },
  /**
   * 对Date的扩展，将 Date 转化为指定格式的String
   * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
   * 年(y)可以用 1-4 个占位符
   * 毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
   * eg:
   * (new Date()).format('yyyy-MM-dd hh:mm:ss.S')   ==> 2006-07-02 08:09:04.423
   * (new Date()).format('yyyy-M-d h:m:s.S')      ==> 2006-7-2 8:9:4.18
   */
  format(fmt, time) {
    time = this.newDate(time);
    let o = {
      'M+': time.getMonth() + 1, // 月份
      'd+': time.getDate(), // 日
      'h+': time.getHours(), // 小时
      'm+': time.getMinutes(), // 分
      's+': time.getSeconds(), // 秒
      'q+': Math.floor((time.getMonth() + 3) / 3), // 季度
      'S': time.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
      }
    }
    return fmt;
  }
};

// 截取8位小数点 科学计数法
export const interceptNumbers = (number, digit) => {
  let result = String(number);
  if (result.indexOf('-') >= 0) {
    result = '0' + String(Number(result) + 1).substr(1);
  }
  if (result.indexOf('.') !== -1) {
    result = result.substring(0, result.indexOf('.') + digit);
  }
  return result;
};
