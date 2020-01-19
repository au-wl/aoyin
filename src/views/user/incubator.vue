<template>
  <div class="incubator-wrapper">
    <van-nav-bar
      :title="headerObj.title"
      :leftText="headerObj.leftText"
      :fixed="headerObj.fixed"
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    
      <div @click="btnClick(1)" class="custom-block-btn">
        静态释放和节点等级计算
        <i class="custom-block-btn-bg">
          <img src="~@/assets/image/img/block-btn-bg@2x.png">
          </i>
      </div>
      <div @click="btnClick(2)" style="margin-top: 10px;" class="custom-block-btn">
        级差奖释放
        <i class="custom-block-btn-bg">
          <img src="~@/assets/image/img/block-btn-bg@2x.png">
          </i>
      </div>
    <div class="incubator-top-price">{{currentPrice}} kiwi/usdt</div>
    
    <div class="incubator-block" v-for="(item, index) in incubatorList" :key="index">
      <p class="block-title">{{item.name}}</p>
      <van-row class="block-row">
        <van-col :span="12">{{item.fixInvestProfitUnfrozenRate}}% / 天 共{{item.invest_type === '1' ? '3' : item.invest_type === '2' ? '7' : '15'}}天</van-col>
        <van-col class="text-right" :span="12">
          <span class="incubator-status" v-if="item.leftTime">持续收益中</span>
          <span class="incubator-status" v-else :class="item.invest_status !== '1' && 'color-unactive'">{{item.invest_status === '1' ? `剩余${item.over_days}天`: '未激活'}}</span>
        </van-col>
      </van-row>
      <p class="incubator-value">{{amount}}kiwi</p>
      <van-slider
        v-model="amount"
        bar-height="7px"
        :step="10"
        :max="maxVal"
        :min="minVal"
        :disabled="item.invest_status === '1' || index !== 0"
      />
      <van-row class="block-row value-wrapper">
        <van-col :span="12">{{minVal}}kiwi</van-col>
        <van-col class="text-right" :span="12">{{maxVal}}kiwi</van-col>
      </van-row>
      <div @click="incubator(item)" class="custom-block-btn" :class="item.btn === '已激活' ? 'btn-active': item.btn === '不可激活' ? 'disabled-active' : ''">
        {{item.btn}}
        <i class="custom-block-btn-bg">
          <img v-if="item.btn === '已激活'" src="~@/assets/image/img/block-btn-bg@2x-active.png">
          <img v-else-if="item.btn === '立即激活'" src="~@/assets/image/img/block-btn-bg@2x.png">
          <img v-else src="~@/assets/image/img/block-btn-bg@2x-disabled.png">
          </i>
      </div>
    </div>

    <!--激活弹窗-->
    <van-dialog
      v-model="showDialog"
      :before-close="dialogConfirm"
      confirmButtonText="激活"
      show-cancel-button>
      <div class="incubator-dialog-wrapper">
        <p class="dialog-title">本次投资冻结</p>
        <p class="dialog-title">{{fixInvestAmountRateFee}}</p>
        <van-field v-model="submitObj.m_security_pwd" type="password" placeholder="请输入资金密码" />
      </div>
    </van-dialog>
  </div>
</template>

<script>
import { Toast, Row, Col, Slider, NavBar, Dialog, Field } from 'vant';
const Decimal = require('decimal.js')
// import { mapState, mapActions, mapGetters } from 'vuex';

export default {
  name: 'incubator',
  components: {
    [Toast.name]: Toast,
    [Row.name]: Row,
    [Col.name]: Col,
    [Slider.name]: Slider,
    [NavBar.name]: NavBar,
    [Dialog.name]: Dialog,
    [Field.name]: Field,
    [Dialog.Component.name]: Dialog.Component
  },
  data() {
    return {
      headerObj: {
        title: '旗舰版孵化器',
        fixed: true,
        leftText: '返回首页'
      },
      showDialog: false,
      version: '',
      submitObj: {
        m_security_pwd: ''
      },
      // 投资扣币的费用比例
      fixInvestAmountRate: ['0.9', '0.1'],
      fixInvestAmountRateFee: '900 kiwi + 100 ceo',
      // 初级孵化金额为准
      amount: 0,
      currentPrice: 0,
      incubatorList: [
        {
          name: '初级孵化',
          fixInvestProfitUnfrozenRate: '0.00',
          over_days: '13',
          leftTime: '',
          invest_status: '0',
          invest_type: '3',
          btn: '立即激活'
        },
        {
          name: '中级孵化',
          fixInvestProfitUnfrozenRate: '0.00',
          leftTime: '',
          invest_status: '0',
          invest_type: '2',
          btn: '不可激活'
        },
        {
          name: '高级孵化',
          fixInvestProfitUnfrozenRate: '0.00',
          leftTime: '',
          invest_status: '0',
          invest_type: '1',
          btn: '不可激活'
        },
      ]
    };
  },
  created() {
  },
  watch: {
  },
  computed: {
    minVal () {
      const calVal = this.version === 'experience' ? 50 : 310
      const reVal = parseInt(new Decimal(calVal).dividedBy(this.currentPrice))
      if (!this.amount) {
        this.amount = reVal
      }
      return reVal
    },
    maxVal () {
      const calVal = this.version === 'experience' ? 300 : 2000
      return parseInt(new Decimal(calVal).dividedBy(this.currentPrice))
    }
  },
  mounted() {
    this.market()

    // 1s更新一次行情
    if (this.timer) clearInterval(this.timer)
    this.timer = setInterval(() => {
      this.market()
    }, 1000)

    // 版本判断
    this.version = this.$route.params.type
    this.invest_vertype = this.version === 'experience' ? '1' : '2'
    this.headerObj.title = this.version === 'experience' ? '体验版孵化器' : '旗舰版孵化器'
    this.init()
  },
  methods: {
    btnClick (param) {
      if (param === 1) {
        this.$api.user.releaseButton1().then(() => {
          Toast('释放成功')
        }).catch(err => {
          Toast(err.data.msg)
        })
      } else {
        this.$api.user.releaseButton2().then(() => {
          Toast('释放成功')
        }).catch(err => {
          Toast(err.data.msg)
          // Toast(err)
        })
      }
    },
    onClickLeft () {
      this.$router.goBack();
    },
    onClickRight () {},
    init () {
      // experience 体验版 flag旗舰版
      this.getInvest()
      this.getConfig()
    },
    async getInvest () {
      // experience 体验版 flag旗舰版
      const res = await this.$api.user.getInvest(this.version === 'experience' ? 1 : 2)
      // this.address = res.data.result.fixInvestProfitUnfrozenRate
      if (res.data.result.length) {
        // 计算不可激活按钮个数
        let count = 0
        let res2 = res.data.result.reverse()
        this.incubatorList.map((item, index) => {
          if (index === 0) {
            this.amount = res2[index].amount
          }
          // if (index === 2 || index === 1) {
          //   res2[index].invest_status = '0'

          // }
          item.leftTime = ''
          item.btn = '立即激活'
          if (res2[index] && res2[index].invest_status === '1') {
            item.btn = '已激活'
          } else {
            count ++
          }
          item = Object.assign({}, item, res2[index] || {})
          this.$set(this.incubatorList, index, item)
          return item
        })
        // 处理不可以激活
        switch (count) {
          case 0:
            this.$set(this.incubatorList[0], 'leftTime', '持续收益中')
            this.$set(this.incubatorList[1], 'leftTime', '持续收益中')
            break
          case 1:
            this.$set(this.incubatorList[0], 'leftTime', '持续收益中')
            break
          case 2:
            this.$set(this.incubatorList[2], 'btn', '不可激活')
            break
          case 3:
            this.$set(this.incubatorList[1], 'btn', '不可激活')
            this.$set(this.incubatorList[2], 'btn', '不可激活')
            break
        }
      }
    },
    async getConfig () {
      // experience 体验版 flag旗舰版
      const res = await this.$api.common.configInfo()
      // 孵化百分比计算
      res.data.result.fixInvestProfitUnfrozenRate.split(",").reverse().forEach((item, index) => {
        this.incubatorList[index].fixInvestProfitUnfrozenRate = new Decimal(item).mul(100)
      })
      // 投资扣币的费用比例提取
      this.fixInvestAmountRate = res.data.result.fixInvestAmountRate.split(",")
    },
    // 弹框数值计算
    incubator (item) {
      if (item.btn === '立即激活') {
        // 不同级别不同金额计算 初级用原额
        const calAmont = item.name === '初级孵化' ? this.amount : new Decimal(this.amount).dividedBy(this.fixInvestAmountRate[0])
        this.submitObj = {
          m_security_pwd: '',
          amount: calAmont,
          invest_vertype: this.invest_vertype,
          invest_type: item.invest_type
        }

        this.showDialog = true
        const num1 = new Decimal(calAmont).mul(this.fixInvestAmountRate[0])
        const num2 = new Decimal(calAmont).mul(this.fixInvestAmountRate[1])
        this.fixInvestAmountRateFee = `${num1} kiwi + ${num2} ceo`
      }
    },
    // 获取行情
    async market() {
      const res = await this.$api.user.market('KIWI_USDT')
      // console.log(res)
      this.currentPrice = res.data.result.KIWIUSDT
    },
    dialogConfirm (action, done) {
      if(action === 'cancel') {
        this.showDialog = false
        done()
        return
      }
      if (!this.submitObj.m_security_pwd) {
        Toast(`请输入密码`)
        done(false)
        return
      }
      this.$api.user.toInvest(this.submitObj).then(res => {
        Toast(`激活成功`)
        done()
        // 再次获取数据
        this.getInvest()
      }).catch(err => {
        switch(err.data.msg) {
          case 'INVEST_CYCLE_ERROR':
            Toast(`投资周期错误`)
            break
          case 'NO_FREE_INVEST_CYCLE':
            Toast(`没有空余投资周期`)
            break
          case 'INVEST_AMOUNT_ERROR':
            Toast(`投资金额错误`)
            break
        }
        done(false)
      })
      // console.log(res)
    },
  },
  destroyed() {
    clearInterval(this.timer)
  }
};
</script>

<style lang="less" scoped>
.incubator-wrapper {
  padding-top: 50px;
  
  .incubator-block {
    position: relative;
    padding: 10px 15px;
    background-color: #15283a;
    margin-top: 10px;

    .block-title {
      font-size: 16px;
      font-weight: bold;
    }

    .incubator-status {
      position: absolute;
      right: 15px;
      top: 17px;
    }
  }

  .incubator-value {
    text-align: center;
    font-weight: bold;
    font-size: 16px;
  }
  .van-slider {
    margin: 10px 0;
  }

  .block-row {
    line-height: 30px;
  }

  .value-wrapper {
    color: #d1d3d4;
    margin-bottom: 8px;
  }

  .btn-active {
    // background-color: #1859c5;
    color: #fff;
    // color: #5bf36f;
  }

  .disabled-active {
    // background-color: #919294;
    color: #fff;
  }

  .incubator-dialog-wrapper {
    padding: 20px;

    .dialog-title {
      line-height: 30px;
      text-align: center;
    }

    .van-field {
      margin-top: 10px;
      border: solid 1px #096183;
    }
  }

  .incubator-top-price {
    text-align: center;
    background-color: #15283a;
    line-height: 30px;
  }
}
.text-right {
  text-align: right;
}
.color-unactive {
  color: #828282;
}
</style>