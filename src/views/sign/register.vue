<template>
  <div class="register-wrapper">
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
        label="+86"
        placeholder="请输入手机号"
      />
    </div>
    <div class="input-box">
      <van-field
        v-model="verifyCode"
        center
        clearable
        placeholder="请输入短信验证码"
      >
      <van-button v-if="isCanSend" @click="sendCode" slot="button" size="small" type="primary">获取验证码</van-button>
      <van-button v-else slot="button" size="small" type="primary">{{sendTimeout}}s</van-button>
      </van-field>
    </div>
    <div class="input-box">
      <van-field
        v-model="pwd"
        type="password"
        clearable
        placeholder="请输入6-16位数字、字母组合密码"
      />
    </div>
    <div class="input-box">
     <van-field
        v-model="pwdAgin"
        type="password"
        clearable
        placeholder="请再次输入密码"
      />
      <div class="line-row tips">
        <van-row type="flex" justify="space-between">
          <van-col><van-checkbox v-model="chkAgree" shape="square">我已阅读并接受相关条款<span @click="toServeStatement">《服务条款》</span><span @click="toPrivacyStatement">《隐私政策》</span></van-checkbox></van-col>
        </van-row>
      </div>
    </div>
    <div class="btn-wrapper">
      <div @click="ckVerifyCode" class="custom-block-btn">
                      注册
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
import { Field, NavBar, Row, Col, Toast, Checkbox, Button } from 'vant';
import rules from '@/utils/rules';
import * as BASE from '@/service/base';

export default {
  name: '',
  components: {
    [NavBar.name]: NavBar,
    [Field.name]: Field,
    [Row.name]: Row,
    [Col.name]: Col,
    [Toast.name]: Toast,
    [Checkbox.name]: Checkbox,
    [Button.name]: Button
  },
  data() {
    return {
      m_name: '86', // 区号
      username: '',
      verifyCode: '',
      pwd: '',
      pwdAgin: '',
      chkAgree: false,
      isCanSend: true,
      sendTimeout: BASE.VerifySendTimeout
    };
  },
  created() {},
  mounted() {
    this.calBottomImg();
  },
  methods: {
    countDownTime() {
      var interval = setInterval(() => {
        if (--this.sendTimeout <= 0) {
          clearInterval(interval);
          this.sendTimeout = BASE.VerifySendTimeout;
          this.isCanSend = true;
        }
      }, 1000);
    },
    sendCode() {
      if (this.username && rules.mobile.test(this.username)) {
        if (this.isCanSend) {
          this.$api.sign.verifyCode({
            phoneNum: `${this.m_name}${this.username}`
          }).then(res => {
            Toast('验证码发送成功');
            this.isCanSend = false;
            this.countDownTime();
          }).catch(error => {
            Toast(this.$t(`lang.system.${error.data.msg}`));
          });
        }
      } else {
        Toast('请输入正确的手机号');
      }
    },
    beforeSubmit() {
      if (!this.username) {
        Toast('请输入手机号码');
        return false;
      }
      if (!(rules.mobile.test(this.username))) {
        Toast('请输入正确的手机号码');
        return false;
      }
      if (!this.verifyCode) {
        Toast('请输入验证码');
        return false;
      }
      if (!rules.code.test(this.verifyCode)) {
        Toast('请输入正确的验证码');
        return false;
      }
      if (!this.pwd) {
        Toast('请输入密码');
        return false;
      }
      if (!rules.letterDigit.test(this.pwd)) {
        Toast('请输入6-16位数字、字母组合密码');
        return false;
      }
      if (this.pwd !== this.pwdAgin) {
        Toast('两次输入的密码不一致');
        return false;
      }
      if (!this.chkAgree) {
        Toast('请同意用户服务协议');
        return false;
      }
      return true;
    },
    // 验证数字验证码是否正确
    ckVerifyCode() {
      if (this.beforeSubmit()) {
        this.$api.sign.ckVerifyCode({
          phoneNum: `${this.m_name}${this.username}`,
          verifyCode: this.verifyCode
        }).then(res => {
          this.register();
        }).catch(error => {
          Toast(this.$t(`lang.system.${error.data.msg}`));
        });
      }
    },
    register() {
      this.$api.sign.register({
        area_code: this.m_name,
        m_name: this.username,
        m_pwd: this.pwd
      }).then(res => {
        Toast('注册成功');
        this.$router.replace('/login');
      }).catch(error => {
        this.verifyCode = '';
        Toast(this.$t(`lang.system.${error.data.msg}`));
      });
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
    toServeStatement() {
      this.$router.togo('服务条款', '~/other/statement');
    },
    toPrivacyStatement() {
      this.$router.togo('隐私条款', '~/other/statement');
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
.register-wrapper{
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
  /* 验证码按钮 */
  .van-button--primary{
    font-size: 14px;
    color: @main-color;
    background-color: transparent !important;;
    border: 1px solid transparent !important;;
  }
}
</style>
