<template>
  <div class="order-done-buyer-wrapper" style="visibility:hidden;">
    <van-nav-bar
      :title="headerObj.title"
      left-arrow
      :fixed="headerObj.fixed"
      @click-left="back"
    />
    <div class="content nav-top">
      <van-cell-group title="订单状态">
        <van-cell class="status" :title="orderStatusText.status" :value="orderInfo.m_name|formatPhone" size="large" />
        <van-cell class="tips" :title="orderStatusText.tips" value="卖方" size="large" />
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
        <p class="cell-text">在转账过程中请勿备注类似BTC、USDT等信息，防止造成您的汇款被拦截、银行卡被冻结等问题，因此到账延迟，卖方可选择拒绝成交。</p>
      </van-cell-group>
      <!--上传图片-->
      <van-cell-group v-if="orderStatus==1&&payStatus==2" class="img-uploader-box" title="修改支付截图">
        <p class="tips">图片大小:<2M；格式:png，jpg</p>
        <van-uploader
          preview-size="100%"
          :before-read="beforeUpload"
          :after-read="uploadImg"
          :max-count="1"
          v-model="fileList"
          >
          <div class="img-area id-card1">
            <div class="aui-btn aui-btn-info aui-btn-outlined">点击上传</div>
          </div>
        </van-uploader>
      </van-cell-group>
      <div v-if="orderStatus!=='3'">
        <div v-if="orderStatus==1&&payStatus==2" class="custom-block-btn">
          {{statusText}}
          <i class="custom-block-btn-bg"><img src="~@/assets/image/img/block-btn-bg@2x.png"></i>
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
import { NavBar, Cell, CellGroup, Toast, Icon, Uploader } from 'vant';
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
    [Uploader.name]: Uploader
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
      statusText: '卖家放币中',
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
      // 上传图片
      imgBaseUrl: BASE.ImageUrl,
      fileList: [],
      havePayImg: '',
      // 循环刷新
      onceLoading: false,
      seI_autoFn: null, // 定时器
      autoFnIndex: 0 // 定时器执行的次数，可判断执行某些东西
    };
  },
  created() {
    this.queryParams = this.$route.query;
    this.id = this.queryParams.id;
    this.orderStatus = this.queryParams.orderStatus;
    this.payStatus = this.queryParams.payStatus;
  },
  mounted() {
    this.autoFn();
    this.$el.style.visibility = 'visible';
  },
  watch: {},
  computed: {
    orderStatusText() {
      let obj = {};
      if (this.orderStatus === '1' && this.payStatus === '2') {
        obj = {
          status: '已支付',
          tips: '等待卖方放币'
        };
      } else if (this.orderStatus === '2') {
        obj = {
          status: '已完成',
          tips: '订单已完成'
        };
      } else if (this.orderStatus === '3') {
        obj = {
          status: '已取消',
          tips: '订单已取消,无法查看支付信息'
        };
      }
      return obj;
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
    // 实时刷新
    autoFn() {
      let self = this;
      if (self.autoFnIndex < 2) {
        // 你要执行的方法function()
        self.getOrderInfo();
        self.autoFnIndex++;
      } else {
        self.autoFnIndex = 0;
      }
      // 每次清空定时器
      clearTimeout(self.seI_autoFn);
      // 定时器更新时间
      let refushTime = 5 * 1000;
      self.seI_autoFn = setTimeout(function() {
        self.autoFn();
      }, refushTime);
    },
    getOrderInfo() {
      this.$el.style.visibility = 'visible';
      this.$api.order.orderInfo({
        id: this.id
      }).then(res => {
        // console.log("买家---done-----"+JSON.stringify(res));
        let result = res.data.result;
        this.orderInfo = result;
        this.accountInfo = this.orderInfo.paymentVO;
        if (this.orderInfo.receive_status === '3' && this.orderInfo.order_status === '1') {
          this.statusText = '卖家已放币';
          // $evt.trigger('refreshOrder', true);
          utils.say('卖家已放币', 750);
        }
      }).catch(error => {
        Toast(this.$t(`lang.system.${error.data.msg}`));
      });
    },
    beforeUpload(file) {
      return new Promise((resolve, reject) => {
        if (file.size > 2 * 1024 * 1024) {
          Toast('请上传小于2M的图片');
          reject();
        } else {
          resolve();
        }
      });
    },
    uploadImg(file) {
      this.$api.common.uploadImage({
        file: file.content
      }).then(res => {
        let data = res.data;
        this.havePayImg = this.imgBaseUrl + data.result;
        this.saveImg(this.havePayImg);
      }).catch(error => {
        Toast(this.$t(`lang.system.${error.data.msg}`));
      });
    },
    saveImg(imgUrl) {
      this.$api.common.saveImage({
        id: this.id,
        pay_img: imgUrl
      }).then(res => {
        // let data = res.data;
      }).catch(error => {
        Toast(this.$t(`lang.system.${error.data.msg}`));
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
  destroyed() {}
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
/*图片上传*/
.img-uploader-box.van-cell-group{
  padding: 10px 16px;
  margin-bottom: 30px;
  background-color: #131F25;
  .tips{
    margin-bottom: 10px;
    font-size: 12px;
    color: #999;
  }
  .van-uploader{
    width: 100%;
  }
}
.img-uploader-box div[class*="id-card"]{
  width: 100%;
  min-height: 220px;
  text-align: center;
  border: 1px solid transparent;
}
.img-uploader-box .img-area .aui-btn{
  width: 40%;
  height: 45px;
  line-height: 45px;
  margin: 25% auto auto;
  color: #096183;
  border: 1px solid;
  border-radius: 4px;
}
.id-card1{
  background: url("~@/assets/image/img/upload_img.png") no-repeat center center;
  background-size: 100%;
}
.pay-img-box{
  padding: 10px 16px;
}
</style>

<style lang="less">
.order-done-buyer-wrapper{
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
  /*上传图片*/
  .img-uploader-box.van-cell-group{
    .van-uploader__input-wrapper{
      width: 100%;
    }
  }
  .custom-block-btn{
    margin-bottom: 30px;
  }
}
</style>
