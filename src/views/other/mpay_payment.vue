<template>
  <div class="mpay-payment-wrapper" style="visibility:hidden;">
    <van-nav-bar
      :title="headerObj.title"
      left-arrow
      :fixed="headerObj.fixed"
      @click-left="back"
    />
    <div class="content nav-top">
      <van-cell-group title="支付金额">
        <van-cell class="status" :title="orderStatusText.status" size="large" />
        <van-cell class="tips" :title="orderStatusText.tips" size="large" />
        <p class="href-text" @click="toOTC">余额不足?去充值</p>
      </van-cell-group>
      <van-cell-group title="订单信息">
        <van-cell title="请在该时间之前完成支付" :value="orderInfo.pay_time" />
        <van-cell @click="copy" :data-clipboard-text="orderInfo.game_order_no" class="copy" title="订单号" :value="orderInfo.game_order_no">
          <van-icon
            slot="right-icon"
            name="ali iconfont iconfuzhi_o-copy"
            style="line-height:inherit;"
          />
        </van-cell>
        <van-cell title="付款方式" value="Mpay支付" />
        <van-cell title="币种" :value="currency" />
      </van-cell-group>
      <van-cell-group title="资金密码">
        <van-field v-model="pwd" placeholder="请输入资金密码" type="password" />
      </van-cell-group>
    </div>
    <div class="btn-wrapper">
      <div @click="beforeSubmit(2)" class="custom-block-btn">
                      立即支付
        <i class="custom-block-btn-bg"><img src="~@/assets/image/img/block-btn-bg@2x.png"></i>
      </div>
    </div>
  </div>
</template>

<script>
import ClipboardJS from 'clipboard';
import { NavBar, Cell, CellGroup, Toast, Icon, Field, Dialog } from 'vant';
import { mapState, mapGetters } from 'vuex';
import * as utils from '@/utils/utils';
import * as BASE from '@/service/base';

export default {
  name: '',
  components: {
    [NavBar.name]: NavBar,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Toast.name]: Toast,
    [Icon.name]: Icon,
    [Field.name]: Field,
    [Dialog.Component.name]: Dialog.Component
  },
  data() {
    return {
      headerObj: {
        fixed: true,
        title: 'Mpay支付'
      },
      // 地址
      schemeParams: '',
      orderInfo: {},
      currency: '',
      restCurrency: 0,
      costCurrency: 0,
      pwd: ''
    };
  },
  created() {
    this.schemeParams = JSON.parse(this.$route.query.schemeParams);
    this.appid = this.schemeParams.appid;
    this.mchid = this.schemeParams.mchid;
    this.gameOrderNo = this.schemeParams.gameOrderNo;
    this.schemeVal = this.schemeParams.schemeVal;
    console.log(this.schemeParams);
    console.log(this.appid);
    console.log(this.mchid);
    console.log(this.gameOrderNo);
    console.log(this.schemeVal);
  },
  mounted() {
    this.$el.style.visibility = 'visible';
    if (this.isLogined) {
      this.getOrderInfo();
    } else {
      Dialog.alert({
        message: '检测到您未登录,请先登录!'
      }).then(() => {
        this.$router.togo('/login');
      });
    }
  },
  watch: {
    isLogined(nval, oval){
      this.getOrderInfo();
    }
  },
  computed: {
    ...mapState('sign', {
      userInfo: state => state.userInfo
    }),
    ...mapGetters('sign', [
      'isLogined'
    ]),
    orderStatusText() {
      let obj = {
        status: `约${this.orderInfo.charge_amount}${this.currency}`,
        tips: `余额${this.restCurrency}${this.currency}`
      };
      return obj;
    }
  },
  filters: {
  },
  methods: {
    getOrderInfo() {
      if (this.isLogined) {
        this.$api.order.gameOrderInfo({
          gameOrderNo: this.gameOrderNo,
          mchid: this.mchid,
          appid: this.appid,
          withToken: true
        }).then(res => {
          console.log(res);
          if (res.data.result) {
            let result = res.data.result;
            this.orderInfo = JSON.parse(result.params);
            console.log(this.orderInfo);
            this.notReady = false;
            this.currency = this.orderInfo.symbol;
            this.costCurrency = utils.interceptNumbers(this.orderInfo.charge_amount,9);
            this.getAssetInfo();
          }
        }).catch((error) => {
          // console.log(error);
        });
      }
    },
    getAssetInfo() {
      if (this.isLogined) {
        this.$api.otc.otcAvailableByCurrecy({
          currency: this.currency,
          withToken: true
        }).then(res => {
          let result = res.data.result;
          for (let i = 0, len = result.length; i < len; i++) {
            if (result[i].currency === this.currency) {
              this.restCurrency = result[i].available_balance;
            }
          }
        }).catch((error) => {
          // console.log(error);
        });
      }
    },
    beforeSubmit(payStatus) {
      if (this.costCurrency * 1 > this.restCurrency * 1) {
        Toast('可用余额不足');
        return false;
      }
      //支付方式验证
      if (!this.pwd) {
        Toast('请输入资金密码');
        return false;
      } else if (this.userInfo.m_security_pwd && this.userInfo.m_security_pwd !== '') {
        this.submit(payStatus);
      } else {
        Dialog.confirm({
          message: '检测到您的账户尚未设置资金密码',
          confirmButtonText: '去设置'
        }).then(() => {
          this.$router.togo('/my/security');
        }).catch(() => {
          // on cancel
        });
      }
    },
    submit(payStatus) {
      this.$api.otc.gameDeal({
        appid: this.appid,
        mchid: this.mchid,
        game_order_no: this.gameOrderNo,
        m_security_pwd: this.pwd,
        pay_status: payStatus
      }).then(res => {
        if (this.schemeVal !== 'null') {  
          Dialog.confirm({
            message: '操作成功,是否离开Mpay'
          }).then(() => {
            window.location = this.schemeVal;
          }).catch(() => {
            this.$router.goBack();
          });
        } else {
          utils.say("支付成功",1000);
        }
      }).catch(error => {
        Toast(this.$t(`lang.system.${error.data.msg}`));
      });
    },
    toOTC() {
      this.$router.replace('/market');
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
  destroyed() {}
};
</script>

<style lang="less" scoped>
.content{
  margin-bottom: 30px;
}
/*头部样式*/
.status.van-cell{
  .van-cell__value{
    color: #fff !important;
  }
  .van-cell__title{
    font-size: 20px;
    font-weight: bold;
    color: @main-color;
  }
}
.tips.van-cell{
  padding: 0 16px 15px;
  font-size: 12px;
  .van-cell__title{
    flex: 5;
    font-size: 12px;
  }
  .van-cell__value{
    color: #fff !important;
  }
}
.href-text{
  padding: 0 16px 12px;
  text-decoration: underline;
  background-color: #131F25;
}
/*end*/
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

</style>

<style lang="less">
.mpay-payment-wrapper{
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
