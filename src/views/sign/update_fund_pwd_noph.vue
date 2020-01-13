<template>
  <div class="register-wrapper">
    <van-nav-bar
      :title="headerObj.title"
      left-arrow
      :fixed="headerObj.fixed"
      @click-left="back"
    />
    <div class="nav-top"></div>
    <div class="input-box">
      <van-row>
        <van-col class="input-title" span="24">原资金密码</van-col>
      </van-row>
      <van-field
        v-model="oldPwd"
        type="password"
        clearable
        placeholder="请输入原资金密码"
      />
    </div>
    <div class="input-box">
      <van-row>
        <van-col class="input-title" span="24">新资金密码</van-col>
      </van-row>
      <van-field
        v-model="newPwd"
        type="password"
        clearable
        placeholder="请输入6-16位数字、字母组合的新密码"
      />
    </div>
    <div class="input-box">
      <van-row>
        <van-col class="input-title" span="24">确认资金密码</van-col>
      </van-row>
      <van-field
        v-model="repwd"
        type="password"
        clearable
        placeholder="请确认资金密码"
      />
    </div>
    <div class="btn-wrapper">
      <div @click="submit" class="custom-block-btn">
                      保存
        <i class="custom-block-btn-bg"><img src="~@/assets/image/img/block-btn-bg@2x.png"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { Field, NavBar, Row, Col, Toast, Checkbox, Button } from 'vant';
import rules from '@/utils/rules';
import { say } from '@/utils/utils';
import * as BASE from '@/service/base';
import { mapState, mapActions } from 'vuex';

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
      headerObj: {
        fixed: true,
        title: '资金密码'
      },
      m_name: '86', // 区号
      oldPwd: '',
      newPwd: '',
      repwd: ''
    };
  },
  created() {
  },
  computed: {
    ...mapState('sign', {
      userInfo: state => state.userInfo
    })
  },
  mounted() {
  },
  methods: {
    ...mapActions('sign', [
      'UpdateAccData'
    ]),
    beforeSubmit() {
      if (!this.oldPwd) {
        Toast('请输入原资金密码');
        return false;
      }
      if (!this.newPwd) {
        Toast('请输入新资金密码');
        return false;
      }
      if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(this.newPwd)) {
        Toast('请输入6-16位数字、字母组合密码');
        return false;
      }
      if (!this.repwd) {
        Toast('请输入确认密码');
        return false;
      } else if (this.newPwd !== this.repwd) {
        Toast('两次输入的密码不一致');
        return false;
      }
      return true;
    },
    submit() {
      if (this.beforeSubmit()) {
        this.$api.sign.upFundPwdnp({
          m_security_pwd: this.newPwd,
          old_m_security_pwd: this.oldPwd
        }).then(res => {
          this.$store.dispatch('sign/UpdateAccData');
          say('设置成功', 1000);
        }).catch(error => {
          Toast(this.$t(`lang.system.${error.data.msg}`));
        });
      }
    },
    back() {
      this.$router.goBack();
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
  .input-title{
    padding: 5px 16px;
  }
  /* 验证码按钮 */
  .van-button--primary{
    font-size: 14px;
    color: @main-color;
    background-color: transparent !important;
    border: 1px solid transparent !important;
  }
}
</style>
