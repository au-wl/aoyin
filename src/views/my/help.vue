<template>
  <div class="help-wrapper" style="visibility:hidden;">
    <van-nav-bar
      :title="headerObj.title"
      left-arrow
      :fixed="headerObj.fixed"
      @click-left="back"
    />
    <van-collapse class="nav-top" v-model="activeNames">
      <van-collapse-item class="li-item" title="账号及密码？" name="1">
        <van-row @click="toHelpContent('1')" class="custom-line">
          <van-col>注册和登录</van-col>
        </van-row>
        <van-row @click="toHelpContent('2')" class="custom-line">
          <van-col>设置安全密码</van-col>
        </van-row>
        <van-row @click="toHelpContent('3')" class="custom-line">
          <van-col>修改登录密码</van-col>
        </van-row>
      </van-collapse-item>
      <van-collapse-item class="li-item" title="如何获取数字货币？" name="2">
        <van-row @click="toHelpContent('5')" class="custom-line">
          <van-col>OTC 买入数字货币</van-col>
        </van-row>
        <van-row @click="toHelpContent('6')" class="custom-line">
          <van-col>快捷买币</van-col>
        </van-row>
        <van-row @click="toHelpContent('7')" class="custom-line">
          <van-col>通过其它钱包充值数字货币进入Mpay</van-col>
        </van-row>
        <van-row @click="toHelpContent('8')" class="custom-line">
          <van-col>推荐好友挖矿获得数字货币</van-col>
        </van-row>
      </van-collapse-item>
      <van-collapse-item class="li-item" title="如何提现数字货币？" name="3">
        <van-row @click="toHelpContent('9')" class="custom-line">
          <van-col>OTC 卖出数字货币</van-col>
        </van-row>
        <van-row @click="toHelpContent('10')" class="custom-line">
          <van-col>智能挖矿</van-col>
        </van-row>
        <van-row @click="toHelpContent('11')" class="custom-line">
          <van-col>提现数字货币至其它钱包</van-col>
        </van-row>
      </van-collapse-item>
      <van-collapse-item class="li-item" title="OTC广告商？" name="4">
        <van-row @click="toHelpContent('12')" class="custom-line">
          <van-col>成为OTC广告商</van-col>
        </van-row>
        <van-row @click="toHelpContent('13')" class="custom-line">
          <van-col>配置收款地址</van-col>
        </van-row>
        <van-row @click="toHelpContent('14')" class="custom-line">
          <van-col>发布数字货币出售广告</van-col>
        </van-row>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>
import { NavBar, Collapse, CollapseItem, Row, Col } from 'vant';
import * as BASE from '@/service/base';

export default {
  name: '',
  components: {
    [NavBar.name]: NavBar,
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem,
    [Row.name]: Row,
    [Col.name]: Col
  },
  data() {
    return {
      activeNames: [],
      headerObj: {
        fixed: true,
        title: '帮助中心'
      }
    };
  },
  created() {},
  mounted() {
    this.$el.style.visibility = 'visible';
  },
  watch: {},
  computed: {},
  methods: {
    toHelpContent(index) {
      this.$router.togo({
        name: 'other/iframe',
        query: {
          title: '帮助详情',
          toUrl: BASE.DomainUrl + '/html/mpay/help/' + index + '.html'
        }
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
body{
  background-color: #060d13;
  letter-spacing: 1px;
}
</style>

<style lang="less">
.help-wrapper{
  /* 一级目录 */
 .li-item{
    margin-bottom: 1px;
    letter-spacing: 1px;
  }
  .van-cell:not(:last-child)::after{
    border-bottom: 1px solid transparent;
  }
  .van-collapse-item__content{
    color: @main-color;
  }
  .van-cell{
    font-size: 16px;
    line-height: 38px;
  }
  .van-cell__right-icon{
    height: 38px;
    line-height: 38px;
  }
  .van-cell--clickable:active{
    background-color: transparent;
  }
  /* 二级目录 */
  .van-collapse-item__content{
    padding: 0 16px;
  }
  .van-row{
    height: 44px;
    line-height: 44px;
  }
}
</style>
