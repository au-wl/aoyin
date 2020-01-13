<template>
  <div class="order-done-seller-wrapper" style="visibility:hidden;">
    <van-nav-bar
      :title="headerObj.title"
      left-arrow
      :fixed="headerObj.fixed"
      @click-left="back"
    />
    <div class="content nav-top">
      <van-cell-group title="订单状态">
        <van-cell class="status" :title="orderStatusText.status" :value="orderInfo.m_name|formatPhone" size="large" />
        <van-cell class="tips" :title="orderStatusText.tips" value="买家" size="large" />
      </van-cell-group>
      <van-cell-group title="交易信息">
        <van-cell title="下单时间" :value="orderInfo.created_date" />
        <van-cell @click="copy" :data-clipboard-text="orderInfo.order_no" class="copy" title="订单编号" :value="orderInfo.order_no">
          <van-icon
            slot="right-icon"
            name="ali iconfont iconfuzhi_o-copy"
            style="line-height:inherit;"
          />
        </van-cell>
        <van-cell title="数量" :value="orderInfo.trade_num+' '+orderInfo.symbol" />
        <van-cell title="单价" :value="'￥'+orderInfo.price" />
        <van-cell v-if="orderInfo.pay_usdtrate" title="汇率" :value="orderInfo.pay_usdtrate" />
        <van-cell title="总交易额" :value="'￥'+orderInfo.total_price" />
      </van-cell-group>
      <van-cell-group title="支付信息">
        <van-cell :value="accountInfo.payment_no">
          <template slot="title">
            <span class="custom-title">{{paymentDictionary[accountInfo.payment_type]}}</span>
            <div class="icon-pay">
              <img :src="paymentIconSrc[accountInfo.payment_type]">
            </div>
          </template>
        </van-cell>
        <van-cell v-if="accountInfo.name" title="收款名称" :value="accountInfo.name" />
        <van-cell @click="copy" :data-clipboard-text="orderInfo.amount_pwd" class="copy" title="付款备注信息" :value="orderInfo.amount_pwd">
          <van-icon
            slot="right-icon"
            name="ali iconfont iconfuzhi_o-copy"
            style="line-height:inherit;"
          />
        </van-cell>
        <p class="cell-text">如您未收到款项，请不要点击右下角"确认收款并放币"按钮,否则有可能造成资金损失。</p>
      </van-cell-group>
      <div v-if="orderStatus==1&&payStatus==2">
        <!-- 已支付 -->
        <div class="btn-area">
          <van-button v-if="receiveStatus==1" @click="submit(2,'未收到款项')" plain :disabled="notComfirm" type="default" size="large">未收到款项<span v-if="notComfirm">({{sendTimeout}})</span></van-button>
          <van-button v-else-if="receiveStatus==2" disabled type="default" size="large">
            <span>{{appealStatusText}}</span>
          </van-button>
          <van-button @click="submit(3,'确认收款并放币')" type="primary" size="large">确认收款并放币</van-button>
        </div>
      </div>
      <van-cell-group title="支付凭证图片">
        <div v-if="orderInfo.pay_img" class="pay-img-box">
          <img :src="orderInfo.pay_img" >
        </div>
        <p v-else class="cell-text">未上传</p>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import ClipboardJS from 'clipboard';
import { NavBar, Cell, CellGroup, Toast, Icon, Button, Dialog } from 'vant';
import * as utils from '@/utils/utils';

export default {
  name: '',
  components: {
    [NavBar.name]: NavBar,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Toast.name]: Toast,
    [Icon.name]: Icon,
    [Button.name]: Button,
    [Dialog.Component.name]: Dialog.Component
  },
  data() {
    return {
      headerObj: {
        fixed: true,
        title: '订单详情'
      },
      queryParams: {},
      id: '',
      // 1:正在进行, 2:已完成, 3:取消
      orderStatus: '',
      // 订单状态 1：待支付，2：已支付，3；已取消
      payStatus: '',
      receiveStatus: '',
      paymentDictionary: {
        '1': '微信',
        '2': '支付宝',
        '3': '银行卡',
        '4': '农信',
        '5': 'USDT交易',
        '6': 'Mpay交易'
      },
      paymentIconSrc: {
        '1': require('@/assets/image/icon/WeChat.png'),
        '2': require('@/assets/image/icon/alipay.png'),
        '3': require('@/assets/image/icon/pay.png'),
        '4': require('@/assets/image/icon/nongxin.png'),
        '5': require('@/assets/image/icon/usdt.png'),
        '6': require('@/assets/image/icon/logo.png')
      },
      orderInfo: '',
      accountInfo: '',
      appealStatus: '0', // 申诉状态
      // 点击未收到收款
      notComfirm: true,
      // 倒计时
      sendTimeout: 300,
      duration: 300,
      intervalTimer: null
    };
  },
  created() {
    this.queryParams = this.$route.query;
    this.id = this.queryParams.id;
    this.orderStatus = this.queryParams.orderStatus;
    this.payStatus = this.queryParams.payStatus;
    this.receiveStatus = this.queryParams.receiveStatus;
  },
  mounted() {
    this.getOrderInfo();
  },
  watch: {},
  computed: {
    orderStatusText() {
      let obj = {};
      if (this.orderStatus === '1' && this.payStatus === '2') {
        obj = {
          status: '已支付',
          tips: '请确认收款并放币'
        };
      } else if (this.orderStatus === '2') {
        obj = {
          status: '已完成',
          tips: '订单已完成'
        };
      } else if (this.orderStatus === '3') {
        obj = {
          status: '已取消',
          tips: '订单已取消'
        };
      }
      return obj;
    },
    appealStatusText() {
      if (this.appealStatus === '0') {
        return '已提交申诉';
      } else if (this.appealStatus === '1') {
        return '申诉驳回';
      } else if (this.appealStatus === '2') {
        return '申诉通过';
      }
    }
  },
  filters: {
    formatPhone: (val) => {
      if (val) {
        return utils.hidePart(val, 3, 4, 4);
      }
    }
  },
  methods: {
    getOrderInfo() {
      this.$el.style.visibility = 'visible';
      this.$api.order.orderInfo({
        id: this.id
      }).then(res => {
        let result = res.data.result;
        this.orderInfo = result;
        this.accountInfo = this.orderInfo.paymentVO;
        this.cutDownTime(this.orderInfo.pay_time);
        // appealVO申诉对象
        if (this.orderInfo.appealVO) {
          this.appealStatus = this.orderInfo.appealVO.status;
        }
      }).catch(error => {
        Toast(this.$t(`lang.system.${error.data.msg}`));
      });
    },
    // 倒计时
    cutDownTime(dateTime) {
      let self = this;
      // 获取目的日期
      let time = new Date(dateTime).getTime();
      // 获取当前时间
      let nowTime = Date.now();
      if (Math.round((nowTime - time) / 1000) < 300) {
        // 获取时间差
        self.sendTimeout = self.duration - Math.round((nowTime - time) / 1000);
        self.intervalTimer = setInterval(function() {
          if (--self.sendTimeout <= 0) {
            self.notComfirm = false;
            clearInterval(self.intervalTimer);
            self.intervalTimer = null;
            self.sendTimeout = self.duration;
          }
        }, 1000);
      } else {
        this.notComfirm = false;
        clearInterval(self.intervalTimer);
        self.intervalTimer = null;
      }
    },
    submit(changeStatus, msg) {
      Dialog.confirm({
        title: '提示',
        message: msg + '?'
      }).then(() => {
        this.$api.order.confirmOrder({
          id: this.id,
          receive_status: changeStatus
        }).then(res => {
          // $evt.trigger('refreshOrder',true);
          utils.say('提交成功', 1000);
          clearInterval(this.intervalTimer);
          this.intervalTimer = null;
        });
      });
    },
    // 复制充值地址
    copy: function() {
      let clipboard = new ClipboardJS('.copy')
        .on('success', e => {
          Toast(e.text + '复制成功');
          e.clearSelection();
          clipboard.destroy();
        });
    },
    back() {
      this.$router.goBack();
    }
  },
  destroyed() {
    clearInterval(this.intervalTimer);
    this.intervalTimer = null;
  }
};
</script>

<style lang="less" scoped>
.content{
  margin-bottom: 30px;
}
.status.van-cell{
  .van-cell__value{
    color: #fff !important;
  }
  .van-cell__title{
    font-size: 18px;
    font-weight: bold;
    color: @main-color;
  }
}
.tips.van-cell{
  padding: 0 16px 15px;
  color: #fff !important;
  font-size: 12px;
  .van-cell__title{
    flex: 5;
    font-size: 12px;
  }
  .van-cell__value{
    color: #fff !important;
  }
}
.cell-text{
  padding: 20px 16px;
  background: #131F25;
  color: #fff;
  font-size: 12px;
  line-height: 1.5;
}
.icon-pay{
  display: inline-block;
  width: 25px;
  height: 25px;
  margin-left: 5px;
  vertical-align: middle;
}
.pay-img-box{
  padding: 10px 16px;
}
/*按钮*/
.btn-area{
  margin: 30px 16px;
  button{
    margin-bottom: 20px;
  }
}
</style>

<style lang="less">
.order-done-seller-wrapper{
  background: #060d13;
  /*分组cell*/
  .van-cell-group{
    background-color: transparent;
  }
  .van-cell-group__title{
    padding: 16px;
  }
  .van-cell{
    background-color: #131F25 !important;
    color: @sub-color !important;
    font-size: 15px;
    &::after{
      border-bottom: 1px solid transparent !important;
    }
  }
  /*cell 插槽图标*/
  .van-icon{
    margin-left: 5px;
    font-size: 16px;
    color: @main-color;
  }
}
</style>
