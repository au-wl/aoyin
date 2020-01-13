<template>
  <div class="login-wrapper">
    <van-nav-bar
      left-arrow
      @click-left="back"
    />
    <div class="top-area">
      <h1 class="title">
        <i class="logo">
          <img src="~@/assets/image/icon/logo.png">
        </i>
        欢迎使用MPay
      </h1>
    </div>
    <div class="input-box">
     <van-field
        v-model="username"
        clearable
        label="86+"
        placeholder="请输入手机号"
      />
    </div>
    <div class="input-box">
     <van-field
        v-model="pwd"
        type="password"
        clearable
        placeholder="请输入密码"
      />
      <div class="line-row tips">
        <van-row type="flex" justify="space-between">
          <van-col @click="toReg" span="12">没有账号？立即注册</van-col>
          <van-col @click="toForget" span="12" class="text-right">忘记密码？</van-col>
        </van-row>
      </div>
    </div>
    <div class="btn-wrapper">
      <div @click="login" class="custom-block-btn">
        登录
        <i class="custom-block-btn-bg"><img src="~@/assets/image/img/block-btn-bg@2x.png"></i>
      </div>
      <div @click="toWxLogin" class="custom-block-btn margin-t-30">
        微信登录
        <i class="custom-block-btn-bg"><img src="~@/assets/image/img/block-btn-bg@2x.png"></i>
      </div>
    </div>
    <div id="e-bottom-wrapper" class="bottom-wrapper">
      <div class="img-box">
        <img src="~@/assets/image/img/login-bottom@2x.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import { Field, NavBar, Row, Col, Toast } from 'vant';
import { WxAuthConfig } from '@/service/base';
import rules from '@/utils/rules';
import * as $util from '@/utils/utils';
import { mapActions } from 'vuex';
import { getCache } from '@/utils/loclstore';

export default {
  name: '',
  components: {
    [NavBar.name]: NavBar,
    [Field.name]: Field,
    [Row.name]: Row,
    [Col.name]: Col,
    [Toast.name]: Toast
  },
  data() {
    return {
      appid: WxAuthConfig.appid,
      username: '',
      pwd: ''
    };
  },
  created() {},
  mounted() {
    let userInfo = getCache('userInfo', true);
    if (userInfo) {
      this.username = userInfo.m_name;
    }
    this.calBottomImg();
  },
  methods: {
    ...mapActions('sign', [
      'Login'
    ]),
    beforeSubmit() {
      if (!this.username) {
        Toast('请输入手机号码');
        return false;
      };
      if (!(rules.mobile.test(this.username))) {
        Toast('请输入正确的手机号码');
        return false;
      };
      if (!this.pwd) {
        Toast('请输入密码');
        return false;
      };
      return true;
    },
    login() {
      if (this.beforeSubmit()) {
        let params = {
          m_name: this.username,
          m_pwd: this.pwd
        };
        this.$store.dispatch('sign/Login', params)
          .then(() => {
            this.$router.goBack();
          }).catch((error) => {
            Toast(this.$t(`lang.system.${error.data.msg}`));
          });
      }
    },
    toWxLogin() {
      let redirectUrl = encodeURIComponent("http://h5.huanghe02.cn/#/wxLogin");
      let timestamp = $util.dateTime.getTime();
      let wxAuthUrl = WxAuthConfig.wxAuthCodeUrl.replace('APPID',this.appid).replace('REDIRECTURL',redirectUrl).replace('TIMESTAMP',timestamp);
      window.location = wxAuthUrl;
    },
    calBottomImg(){
      var h = document.body.scrollHeight;
      window.onresize = function(){
        if (document.body.scrollHeight < h) {
          document.getElementById("e-bottom-wrapper").style.display = "none";
        }else{
          document.getElementById("e-bottom-wrapper").style.display = "block";
        }
      };
    },
    back() {
      this.$router.goBack();
    },
    toReg() {
      this.$router.togo('/register');
    },
    toForget() {
      this.$router.togo({
        name: 'forgetpwd',
        query: {
          isUpdata: true
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.top-area{
  padding: 25px 15px;
  .title{
    font-weight: bold;
    font-size: 22px;
    .logo{
      display: inline-block;
      width: 38px;
      height: 38px;
      vertical-align: middle;
    }
  }
}

.input-box{
  margin-bottom: 30px;
}

.line-row{
  margin: 10px 16px 10px;
}
.btn-wrapper{
  margin-top: 20%;
}
.bottom-wrapper{
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  font-size: 0;
  z-index: 0;
}
</style>

<style lang="less">
.login-wrapper{
  .van-field__label{
    width: 45px;
  }
  .van-cell:after{
    content: "";
    position: absolute;
    height: 1px;
    right: 16px;
    bottom: 0;
    left: 16px;
    background-color: #073547;
  }
  .tips{
    .van-col{
      font-size: 13px;
    }
  }
}
</style>
