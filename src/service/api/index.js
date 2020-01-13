/**
 * api接口的统一出口
 */
// 各模块接口
import common from '@/service/api/common';
import market from '@/service/api/market';
import otc from '@/service/api/otc';
import sign from '@/service/api/sign';
import my from '@/service/api/my';
import order from '@/service/api/order';
// 其他模块的接口……

// 导出接口
export default {
  common,
  market,
  otc,
  sign,
  my,
  order
  // ……
};
