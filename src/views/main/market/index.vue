<template>
  <div class="market-wrapper" style="visibility:hidden;">
    <van-swipe style="height: 165px;" :autoplay="3000">
      <van-swipe-item v-for="(image, index) in banner" :key="index">
        <img v-lazy="image.a_img_file" />
      </van-swipe-item>
    </van-swipe>
    <div class="content">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <van-cell class="list-item" title="MP可用余额" :value="otcAvailable+'枚'" />
        <div v-if="noOrder" class="empty-box">
          <div class="empty-img"><img src="~@/assets/image/loading/empty-logo@2x.png"></div>
           <p class="empty-text">{{emptyText}}</p>
        </div>
        <!--一键买币-->
        <div v-else class="row-box">
          <div class="left-area">
            <div class="title">一键买币</div>
            <van-field
              v-model="dealAmount"
              :placeholder="'输入'+transDirectionObj[transDirection].name+currency+'数量'" />
            <div>数量范围: {{minAmount}} - {{currencyObj.trade_num}}</div>
            <!-- 1:微信  2:支付宝  3:银行卡  4:农信  5:USDT支付（多个逗号隔开）-->
            <div>
              <i v-for="(val,i) in paymentTypes"
                 :key="i"
                 class="icon-img">
                <img :src="paymentIconSrc[val]"/>
              </i>
            </div>
          </div>
          <div class="right-area">
            <div>单价</div>
            <div class="stand-out">￥{{currencyObj.price}}</div>
            <button @click="deal" class="btn info-btn">{{transDirectionObj[transDirection].name}}</button>
          </div>
        </div>
        <div @click="toInvite" class="invite-channel">
          <p class="text">邀请好友   获得分佣</p>
          <img src="~@/assets/image/img/invite-channel.png" />
        </div>
      </van-pull-refresh>
    </div>
    <!--选择支付方式-->
    <van-popup
      v-model="showPaymentPopup"
      position="bottom"
      :style="{ height: 'auto' }">
      <van-row>
        <van-col @click="cancel" class="left-btn" span="6">取消</van-col>
        <van-col class="title" span="12">请选择支付方式</van-col>
        <van-col @click="submit" class="right-btn" span="6">确定</van-col>
      </van-row>
      <van-radio-group v-model="pament">
        <van-cell-group>
          <van-cell
            class="line"
            clickable
            v-for="(val,index) in payments"
            :title="paymentName[val.payment_type]"
            :key="index">
            <van-radio slot="right-icon" :name="val.id" />
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-popup>
  </div>
</template>

<script>
import { Row, Col, PullRefresh, Field, Toast, Swipe, SwipeItem, Popup, CellGroup, Cell, RadioGroup, Radio } from 'vant';
import { mapState, mapActions, mapGetters } from 'vuex';

export default {
  name: 'market',
  components: {
    [Row.name]: Row,
    [Col.name]: Col,
    [PullRefresh.name]: PullRefresh,
    [Field.name]: Field,
    [Toast.name]: Toast,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [Popup.name]: Popup,
    [CellGroup.name]: CellGroup,
    [Cell.name]: Cell,
    [RadioGroup.name]: RadioGroup,
    [Radio.name]: Radio
  },
  data() {
    return {
      // banner
      banner: [],
      // otc列表
      otcTabList: [{
        name: 'MP',
        currency: 'MP',
        showEmpty: true
      }],
      emptyText: '暂无币种出售,请联系客服',
      paymentIconSrc: {
        '1': require('@/assets/image/icon/WeChat.png'),
        '2': require('@/assets/image/icon/alipay.png'),
        '3': require('@/assets/image/icon/pay.png'),
        '4': require('@/assets/image/icon/nongxin.png'),
        '5': require('@/assets/image/icon/usdt.png'),
        '6': require('@/assets/image/icon/logo.png')
      },
      paymentName: {
        '1': '微信',
        '2': '支付宝',
        '3': '银行卡',
        '4': '农信',
        '5': 'USDT支付',
        '6': 'Mpay交易'
      },
      // 交易类型  1 出售  2 购买
      transDirection: 2,
      transDirectionObj: {
        1: {
          name: '出售',
          type: 1
        },
        2: {
          name: '购买',
          type: 2
        }
      },
      currency: 'MP',
      otcAvailable: 0,
      showPaymentPopup: false,
      pament: '',
      // 一键买币
      dealAmount: '',
      paymentTypes: [],
      payments: [],
      minAmount: 1,
      exPrice: 0,
      currencyObj: {},
      noOrder: false,
      // 下拉刷新
      isLoading: false // 控制下拉刷新的加载动画
    };
  },
  created() {},
  mounted() {
    this.currency = this.currencyComputed;
    this.init();
  },
  watch: {
    isLogined(nval, oval){
      this.getAssetInfo();
    }
  },
  computed: {
    ...mapGetters('sign', [
      'isLogined'
    ]),
    currencyComputed: {
      get() {
        let firstCurrency = '';
        for (let i = 0, len = this.otcTabList.length; i < len; i++) {
          firstCurrency = this.otcTabList[0].currency;
        }
        return firstCurrency;
      },
      set(val) {
        this.currency = val;
      }
    },
    totalAmount() {
      return this.currencyObj.price * this.dealAmount;
    }
  },
  methods: {
    toPament() {
      this.$router.togo('/other/mpay')
    },
    init() {
      this.$el.style.visibility = 'visible';
      this.getBanner();
      this.getAssetInfo();
      this.getCurrencyInfo();
    },
    getBanner() {
      this.$api.market.getBanner().then(res => {
        let news = res.data.news;
        if (!news.length || !news[0].a_img_file) {
          this.banner = [{ 'id': 1, 'a_img_file': require('@/assets/image/img/banner.png') }];
        } else {
          this.banner = news;
        }
      });
    },
    // 余额信息(需要token)
    getAssetInfo() {
      if (this.isLogined) {
        this.$api.otc.otcAvailableByCurrecy({
          currency: this.currency,
          withToken: true
        }).then(res => {
          let result = res.data.result;
          for (let i = 0, len = result.length; i < len; i++) {
            if (result[i].currency === this.currency) {
              this.otcAvailable = result[i].available_balance;
            }
          }
        }).catch((error) => {
          // console.log(error);
        });
      }
    },
    getCurrencyInfo() {
      this.$api.market.currencyInfo().then(res => {
        let result = res.data.result;
        if (result) {
          this.noOrder = false;
          this.currencyObj = result;
          this.currency = this.currencyObj.symbol;
          this.paymentTypes = this.currencyObj.payment_types.split(',');
          this.payments = this.currencyObj.payments;
        } else {
          this.noOrder = true;
        }
      });
      this.isLoading = false;
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.getCurrencyInfo();
        this.getAssetInfo();
      }, 500);
    },
    deal() {
      if(!this.isLogined){
        this.$router.togo('/login');
        return;
      }
//    if (this.otcAvailable <= 0) {
//      Toast(`可用数量不足`);
//      return;
//    }
      let dealAmountNum = this.dealAmount * 1;
      if (!dealAmountNum) {
        Toast(`请输入${this.transDirectionObj[this.transDirection].name}数量`);
        return;
      };
      if (dealAmountNum > this.currencyObj.trade_num) {
        Toast(`不能超出最大${this.transDirectionObj[this.transDirection].name}数量`);
        return;
      } else if (dealAmountNum < this.minAmount) {
        Toast(`不能低于最小${this.transDirectionObj[this.transDirection].name}数量`);
        return;
      }
      let regFlag = /^(([1-9][0-9]{0,11}\.[0-9][0-9]{0,7})|([0]\.[0-9][0-9]{0,7})|([1-9][0-9]*))$/;
      if (!regFlag.test(this.dealAmount)) {
        Toast('金额格式不正确,最多保留8位小数');
        return;
      }
      this.showPaymentPopup = true;
    },
    // 下单(需要token)
    submit() {
      if(this.pament){
        this.showPaymentPopup = false;
        this.$api.otc.deal({
          symbol: this.currency,
          advertise_id: this.currencyObj.id,
          total_price: this.totalAmount,
          price: this.currencyObj.price,
          trade_num: this.dealAmount,
          payment_id: this.pament,
          trans_type: this.transDirection
        }).then(res => {
          Toast('下单成功');
          this.pament = '';
          this.getAssetInfo();
          this.getOrderInfo(res.data.result);
        }).catch(error => {
          Toast(this.$t(`lang.system.${error.data.msg}`));
        });
      } else {
        Toast('请选择支付方式');
      }
    },
    // 获取订单详情
    getOrderInfo(id) {
      this.$api.order.orderInfo({
        id: id
      }).then(res => {
        let result = res.data.result;
        this.toDetail(result);
      });
    },
    toDetail(row) {
      if (row.trans_type === '2') { // 买
        if (row.order_status === '1' && row.pay_status === '1') { // 付款给卖家
          this.$router.togo({
            name: 'doing/buyer',
            query: {
              id: row.id
            }
          });
        } else { // 订单状态
          this.$router.togo({
            name: 'done/buyer',
            query: {
              id: row.id,
              payStatus: row.pay_status,
              orderStatus: row.order_status
            }
          });
        }
      } else if (row.trans_type === '1') { // 卖
        if (row.order_status === '1' && row.pay_status === '1') { // 等待买家付款
          this.$router.togo({
            name: 'doing/seller',
            query: {
              id: row.id
            }
          });
        } else { // 订单状态
          this.$router.togo({
            name: 'done/seller',
            query: {
              id: row.id,
              receiveStatus: row.receive_status,
              payStatus: row.pay_status,
              orderStatus: row.order_status
            }
          });
        }
      }
    },
    cancel() {
      this.showPaymentPopup = false;
      this.pament = '';
    },
    toInvite() {
      this.$router.togo('/my/invite');
    }
  },
  destroyed() {}
};
</script>

<style lang="less" scoped>
.content{
  margin: 30px 16px;
}
.row-box{
  display: flex;
  padding: 16px;
  justify-content: space-between;
  margin-bottom: 16px;
  box-shadow: 0px 1px 20px 0px rgba(41, 184, 237, 0.48) inset;
  border-radius: 6px;
  color: #0C82AE;
}
.left-area {
  > div {
    margin-bottom: 15px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .title {
    color: #2CC2FA;
    font-weight: bold;
    font-size: 17px;
  }
  .stand-out {
    color: #2CC2FA;
  }
  .icon-img {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-right: 5px;
  }
}
.right-area {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  .stand-out {
    font-size: 18px;
    color: #2CC2FA;
  }
  .btn {
    min-width: 90px;
    height: 36px;
    line-height: 36px;
    padding: 0 8px;
    font-size: 15px;
    border-radius: 5px;
  }
  .info-btn {
    background: #29B8ED;
    color: #fff;
    &:active{
      background: #1ea9dc;
    }
  }
}

.invite-channel{
  position: relative;
  margin-top: 30px;
  .text{
    position: absolute;
    font-size: 17px;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    letter-spacing: 3px;
  }
}
</style>
<style lang="less">
/*覆盖vant样式*/
.market-wrapper {
  height: 100%;
  .list-item{
    padding: 20px 16px;
    margin-bottom: 30px;
    font-size: 16px;
    border-radius: 6px;
    box-shadow: 0px 1px 20px 0px rgba(41, 184, 237, 0.48) inset;
  }
  .van-cell__value{
    color: @green;
  }
  /*一键买币*/
  .van-pull-refresh{
    height: 100%;
  }
  .van-cell:not(:last-child)::after{
    border: 1px solid transparent;
  }
  .van-cell.van-field{
    background-color: transparent;
    color: @main-color;
    border: 1px solid;
    border-radius: 4px;
  }
  /*弹出层*/
  .van-popup{
    padding: 16px 0;
  }
  .van-cell-group,
  .van-popup{
    background-color: #131F25;
  }
  .line.van-cell:not(:last-child)::after{
    border: 1px solid #08121B;
  }
  .van-radio__icon--checked .van-icon{
    background-color: @main-color;
    border-color: @main-color;
  }
  .van-radio__icon .van-icon{
    border: 1px solid @main-color;
  }
  /*标题*/
  .van-col{
    text-align: center;
    font-size: 15px;
    padding: 16px;
    color: #fff;
  }
  .title{
    font-size: 16px;
  }
  .left-btn{
    color: @sub-color;
  }
  .right-btn{
    color: @main-color;
  }
}
</style>
