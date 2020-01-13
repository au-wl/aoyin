<template>
  <div class="security-wrapper" style="visibility:hidden;">
    <van-nav-bar
      :title="headerObj.title"
      left-arrow
      :fixed="headerObj.fixed"
      @click-left="back"
    />
    <div class="nav-top">
      <van-cell icon="ali iconfont iconshouji" title="手机号码" :value="userPhone"/>
      <van-cell @click="toFundPwd" icon="ali iconfont iconzijinmima" title="资金密码" is-link />
      <van-cell v-if="loginType!='wx'" @click="toReLoginPwd" icon="ali iconfont icondenglu-mima" title="登录密码" is-link />
    </div>
  </div>
</template>

<script>
import { NavBar, Cell } from 'vant';
import { mapState } from 'vuex';

export default {
  name: 'security',
  components: {
    [NavBar.name]: NavBar,
    [Cell.name]: Cell
  },
  data() {
    return {
      headerObj: {
        fixed: true,
        title: '安全设置'
      },
      userPhone: ''
    };
  },
  created() {
    this.userPhone = this.userInfo.m_name;
  },
  computed: {
    ...mapState('sign', {
      userInfo: state => state.userInfo
    }),
    loginType: function(){
      // 来源,0:手机号,1:微信
      if(this.userInfo.clent_agent == 1){
        return 'wx';
      }else if(this.userInfo.clent_agent == 0){
        return 'phone';
      }
    }
  },
  mounted() {
    this.$el.style.visibility = 'visible';
  },
  methods: {
    toFundPwd() {
      if(this.userInfo.clent_agent == 0){ // 来源,0:手机号,1:微信
        this.$router.togo('/sign/fundpwd');
      }else if(this.userInfo.clent_agent == 1){
        if(this.userInfo.m_security_pwd){
          this.$router.togo('/sign/upfundpwdnp');
        }else{
          this.$router.togo('/sign/fundpwdnp');
        }
      }
    },
    toReLoginPwd() {
      this.$router.togo('/sign/reloginpwd');
    },
    back() {
      this.$router.goBack();
    }
  }
};
</script>

<style lang="less" scoped>
</style>

<style lang="less">
.security-wrapper{
  .van-cell{
    background-color: transparent;
    color: @main-color;
  }
  .van-cell__value{
    color: @sub-color;
  }
  .van-cell__right-icon{
    color: @main-color;
  }
  .van-cell__left-icon{
    margin-right: 15px;
  }
}
</style>
