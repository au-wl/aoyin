<template>
  <div class="home-wrapper">
    <div class="home-top-block">
      <img src="~@/assets/image/img/home_banner.png">
    </div>
    <div class="home-top-price">{{currentPrice}} kiwi/usdt</div>
    <van-row class="home-version-wrapper">
      <van-col :span="12" class="version-block" @click="toVersion('experience')">
        <span class="version-title-wrapper">
          <p class="version-title font16">孵化体验版</p>
          <p class="version-subtitle">50~300 usdt</p>
        </span>
      </van-col>
      <van-col :span="12" class="version-block" @click="toVersion('flag')">
        <span class="version-title-wrapper">
          <p class="version-title font16">孵化旗舰版</p>
          <p class="version-subtitle">310~2000 usdt</p>
        </span>
      </van-col>
    </van-row>
    <div class="home-property-wrapper" v-if="isLogined">
      <div class="property-title font16">我的资产</div>
      <div class="property-list-block" v-for="(item, index) in propertyList" :key="index">
        <span class="property-list-icon">
          <img class="icon-img" v-if="item.currency === 'KIWI'" src="~@/assets/image/img/coin_icon1.png">
          <img class="icon-img" v-if="item.currency === 'CEO'" src="~@/assets/image/img/coin_icon2.png">
          <!-- <span>{{item.currency}}币</span> -->
        </span>
        <span class="property-balance">
          <!-- KV字段处理，如果后台返回的是kiwi则可以不判断 -->
          <p>{{item.currency}}可用：{{item.available_balance}}</p>
          <p>{{item.currency}}冻结：{{item.frozen_balance}}</p>
        </span>
        <span class="property-button-wrapper">
          <van-button class="home-button topup" @click="toTopUp(item)">充值</van-button>
          <van-button class="home-button" @click="toWithdraw(item)">提币</van-button>
        </span>
      </div>
    </div>
  </div>
</template>

<script>

import { Row, Col, Button } from 'vant';
import { mapGetters } from 'vuex';

export default {
  name: 'home',
  components: {
    [Row.name]: Row,
    [Col.name]: Col,
    [Button.name]: Button
  },
  data() {
    return {
      currentPrice: 0,
      propertyList: [
        // {
        //   currency: 'KV',
        //   available_balance: '0',
        //   frozen_balance: '0',
        // },
      ],
      // 计时器
      timer: null
    };
  },
  computed: {
    ...mapGetters('sign', [
      'isLogined'
    ]),
  },
  mounted() {
    this.market()
    // 1s更新一次行情
    if (this.timer) clearInterval(this.timer)
    this.timer = setInterval(() => {
      this.market()
    }, 1000)

    if (this.isLogined) {
      this.getAssets()
    }
  },
  methods: {
    toTopUp (item) {
      this.$router.togo(`/user/topUp/${item.currency}`)
    },
    toWithdraw (item) {
      this.$router.togo(`/user/withdraw/${item.currency}`)
    },
    // 获取资产
    async getAssets() {
      const res = await this.$api.user.getAssets('all')
      this.propertyList = res.data.result
    },
    // 获取行情
    async market() {
      const res = await this.$api.user.market('KIWI_USDT')
      // console.log(res)
      this.currentPrice = res.data.result.KIWIUSDT
    },
    // 去版本页
    toVersion (type) {
      this.$router.togo({
        path: `user/incubator/${type}`
      })
    }
  },
  destroyed() {
    clearInterval(this.timer)
  }
};
</script>

<style lang="less" scoped>
.home-wrapper {
  padding-bottom: 50px;
}
.font16 {
  font-size: 16px;
}
.home-top-block {
  min-height: 100px;
  // line-height: 150px;
  text-align: center;
  color: #fff;

  img {
    display: block;
    width: 100%;
  }
}
.home-top-price {
  border-top: 1px solid #073547;
  line-height: 45px;
  text-align: center;
  background-color: #12202d;
}
.home-version-wrapper {
  border-top: 1px solid #073547;
  background-color: #12202d;

  .version-block {
    padding: 20px;
    text-align: center;
  }

  .version-title-wrapper {
    display: inline-block;
    text-align: left;
  }
  .version-subtitle {
    line-height: 20px;
    font-size: 13px;
    color: #ccccce;
  }
  .version-block:nth-child(1) {
    border-right: 1px solid #073547;
  }
}
.home-property-wrapper {
  margin-top: 10px;
  background-color: #12202d;

  .property-title {
    line-height: 50px;
    text-indent: 15px;
  }

  .property-list-block {
    position: relative;
    border-top: solid 1px #073547;
    padding: 15px;
  }

  .property-balance {
    display: inline-block;
    vertical-align: top;
    margin-left: 10px;
    padding-top: 5px;

    p {
      line-height: 30px;
    }
  }

  .property-list-icon {
    position: relative;
    display: inline-block;
    border-radius: 50%;
    height: 70px;
    width: 70px;
    border: solid 1px #073547;
    line-height: 70px;
    text-align: center;

    // span {
    //   position: relative;
    //   z-index: 1;
    // }

    .icon-img {
      position: absolute;
      width: 100%;
      left: 0;
      top: 0;
      z-index: 0;
      border-radius: 50%;
    }
  }
  .home-button {
    display: inline-block;
    background-color: #224754;
    width: 80px;
    // padding: 10px 0;
    height: 35px;
    line-height: 35px;
    border: none!important;
    color: #29B8ED!important;
    border-radius: 0;
  }
  .property-button-wrapper {
    position: absolute;
    right: 17px;
    top: 17px;
    width: 80px;
  }
  .topup {
    background-color: #0b0f21;
    // color: #fff!important;
  }
}
</style>
