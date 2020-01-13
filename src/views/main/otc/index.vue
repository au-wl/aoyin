<template>
  <div class="otc-wrapper">
    <MainHeader
      :leftText="headerObj.title"
      :rightText="headerObj.rightText"
      :fixed="headerObj.fixed"
      @onClickRight="headerObj.toAdvertise">
    </MainHeader>
    <van-tabs
      @change="switchTab">
      <van-tab
        v-for="(item,index) in otcTabList"
        :key="index"
        :name="item.currency"
        :title="item.name">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <!--场外USDT-->
          <div v-if="currency=='USDT'" class="row-box">
            <div class="left-area">
              <div class="title">一键买币</div>
              <van-field
                v-model="amount"
                :placeholder="'输入'+transDirectionObj[transDirection].name+'数量'" />
              <div>数量范围: {{usdt_minAmount}} ~ {{usdt_maxAmount}}</div>
              <!-- 1:微信  2:支付宝  3:银行卡  4:农信  5:USDT支付（多个逗号隔开）-->
              <div>
                <i v-for="(val,i) in usdtPayments"
                   :key="i"
                   class="icon-img">
                  <img :src="paymentIconSrc[val]"/>
                </i>
              </div>
            </div>
            <div class="right-area">
              <div>单价</div>
              <div class="stand-out">￥{{exPrice}}</div>
              <button @click="toDeal(item)" class="btn info-btn">{{transDirectionObj[transDirection].name}}</button>
            </div>
          </div>
          <!--OTC列表-->
          <van-list
            v-model="loading"
            :finished="finished"
            :offset="offset"
            @load="onLoad">
            <div class="row-box"
              v-for="(item,index) in filterDataList"
              :key="index">
              <div class="left-area">
                <div class="title">{{item.name}}</div>
                <div>数量: <span class="stand-out">{{item.trade_num}}</span></div>
                <div>限量: {{item.least_amount}} ~ {{item.max_amount}}</div>
                <!-- 1:微信  2:支付宝  3:银行卡  4:农信  5:USDT支付（多个逗号隔开）-->
                <div>
                  <i v-for="(val,i) in item.payment_types"
                     :key="i"
                     class="icon-img">
                    <img :src="paymentIconSrc[val]"/>
                  </i>
                </div>
              </div>
              <div class="right-area">
                <div>单价</div>
                <div class="stand-out">￥{{item.price}}</div>
                <button @click="toDeal(item)" class="btn info-btn">{{transDirectionObj[transDirection].name}}</button>
              </div>
            </div>
          </van-list>
          <div v-if="dataList.length==0&&item.showEmpty" class="empty-box">
            <div class="empty-img"><img src="~@/assets/image/loading/empty-logo@2x.png"></div>
             <p class="empty-text">{{emptyText}}</p>
          </div>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import MainHeader from '@/components/Main/Header';
import { Tab, Tabs, PullRefresh, List, Field, Toast } from 'vant';

export default {
  name: 'otc',
  components: {
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [List.name]: List,
    [PullRefresh.name]: PullRefresh,
    [Field.name]: Field,
    [Toast.name]: Toast,
    MainHeader
  },
  data() {
    return {
      headerObj: {
        fixed: true,
        title: 'OTC交易',
        rightText: '发布广告',
        toAdvertise: () => {
          this.$router.togo('/otc/advertise');
        }
      },
      otcTabList: [{
        name: 'USDT',
        currency: 'USDT',
        showEmpty: false
      }, {
        name: 'MP',
        currency: 'MP',
        showEmpty: true
      }],
      paymentIconSrc: {
        '1': require('@/assets/image/icon/WeChat.png'),
        '2': require('@/assets/image/icon/alipay.png'),
        '3': require('@/assets/image/icon/pay.png'),
        '4': require('@/assets/image/icon/nongxin.png'),
        '5': require('@/assets/image/icon/usdt.png'),
        '6': require('@/assets/image/icon/logo.png')
      },
      dataList: [],
      // 交易类型  1 出售  2 购买
      transDirection: 1,
      transDirectionObj: {
        1: {
          name: '购买',
          type: 1
        },
        2: {
          name: '出售',
          type: 2
        }
      },
      currency: '',
      emptyText: '暂无数据',
      // usdt场外交易
      legalCurrency: 'CNY', // 法币币种
      amount: '',
      usdtPayments: [1, 2, 3],
      usdt_minAmount: 0,
      usdt_maxAmount: 0,
      exInfo: {},
      exPrice: 0,
      // 上拉加载
      loading: false, // 控制上拉加载的加载动画
      finished: false, // 控制在页面往下移动到底部时是否调用接口获取数据
      isLoading: false, // 控制下拉刷新的加载动画
      offset: 300,
      totalPage: 0,
      pageNumber: 1,
      pageSize: 10
    };
  },
  created() {},
  mounted() {
    this.currency = this.currencyComputed;
    this.init();
  },
  watch: {},
  computed: {
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
    filterDataList() {
      let newArr = this.dataList.map((item, index, array) => {
        if (typeof item.payment_types === 'string') {
          item.payment_types = item.payment_types.split(',');
        }
        return item;
      });
      return newArr;
    }
  },
  methods: {
    init() {
      this.getEXInfo();
    },
    getEXInfo() {
      this.$api.otc.exInfo({
        currency: this.currency,
        legalCurrency: this.legalCurrency
      }).then(res => {
        let result = res.data.result;
        this.exInfo = result;
        // console.log(res);
      }).catch(error => {
        let data = error.data;
        if (data.result) {
          Toast(data.result);
        } else {
          Toast(this.$t(`lang.system.${error.data.msg}`));
        }
      });
    },
    switchTab(name) {
      this.currency = name;
      this.pageNumber = 1;
      this.dataList = [];
      this.loading = true;// 下拉加载中
      this.finished = false;// 下拉结束
      if (this.loading) {
        this.onLoad();
      }
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.pageNumber = 1;
        this.dataList = [];
        this.loading = true;// 下拉加载中
        this.finished = false;// 下拉结束
        if (this.loading) {
          this.onLoad();
        }
      }, 500);
    },
    onLoad() {
      setTimeout(() => {
        this.$api.otc.otcList({
          currency: this.currency,
          transDirection: this.transDirection,
          currPage: this.pageNumber,
          pageSize: this.pageSize
        }).then(res => {
          let result = res.data.result;
          this.loading = false;
          this.isLoading = false;
          this.totalPage = result.pages;
          this.dataList = this.dataList.concat(result.list);
          if (this.pageNumber >= this.totalPage) {
            this.finished = true;
          }
          this.pageNumber++;
        });
      }, 500);
    },
    toDeal(rowData) {
      this.$router.togo('/otc/deal');
    }
  },
  destroyed() {}
};
</script>

<style lang="less" scoped>
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
</style>
<style lang="less">
/*覆盖vant样式*/

.otc-wrapper {
  /*tab切换栏*/
  .van-tabs--line .van-tabs__wrap {
    height: 56px;
    margin: 16px;
    box-shadow: 0px 1px 20px 0px rgba(41, 184, 237, 0.48) inset;
    border-radius: 3px;
  }
  .van-tabs__nav {
    background-color: transparent;
  }
  [class*=van-hairline]::after {
    border: 0 solid transparent;
  }
  .van-tab {
    line-height: 56px;
    color: #096183;
  }
  .van-tab--active {
    color: @blue;
    font-weight: bold;
  }
  .van-tabs__line {
    height: 2px;
    background-color: @blue;
  }
  /*tab内容*/
  .van-tabs__content {
    margin: 16px;
  }
  .van-tabs{
    margin-top: 56px;
    margin-bottom: 50px;
  }
  /*USDT场外*/
  .van-cell:not(:last-child)::after{
    border: 1px solid transparent;
  }
  .van-cell.van-field{
    background-color: transparent;
    color: @main-color;
    border: 1px solid;
    border-radius: 4px;
  }
}
</style>
