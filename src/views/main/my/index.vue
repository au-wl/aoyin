<template>
  <div class="my-wrapper">
    <MainHeader
      :leftText="headerObj.title"
      :fixed="headerObj.fixed"
      >
    </MainHeader>
    <div class="nav-top">
      <div @click="updateNicknameBefore" v-if="isLogined" class="top-card">
        <div class="logo-area"><img src="~@/assets/image/icon/logo.png"/></div>
        <div class="name-area">
          <p class="username">{{nickname}}</p>
          <span>修改用户名<i class="iconfont iconbianji"></i></span>
        </div>
      </div>
      <div class="list-item">
        <van-cell @click="toInvite" icon="ali iconfont iconyaoqinghaoyou" title="邀请好友" is-link />
        <!--<van-cell icon="ali iconfont iconyishoukuan" title="收款方式" is-link />-->
        <!--<van-cell icon="ali iconfont iconguanggao" title="我的广告" is-link />-->
        <van-cell @click="toMyOrder" icon="ali iconfont iconorder" title="我的订单" is-link />
        <!--<van-cell icon="ali iconfont iconlaoban" title="广告商" is-link :value="bossAuthText[0]"/>-->
        <van-cell @click="toService" :data-clipboard-text="appConfig.customerInfo" class="copy" icon="ali iconfont iconxiaoxi" title="联系客服" is-link />
        <van-cell @click="toOnlineFK" icon="ali iconfont iconkefu" title="在线客服" is-link />
        <van-cell @click="toSecurity" icon="ali iconfont iconanquan" title="安全设置" is-link />
        <van-cell @click="toHelp" icon="ali iconfont iconicon-test" title="帮助中心" is-link />
        <van-cell @click="toDownload" icon="ali iconfont iconxiazai" title="下载App" is-link />
      </div>
    </div>
    <div class="bottom-wrapper tabbar-bottom">
      <div @click="loginOut" v-if="isLogined" class="custom-block-btn">
                      退出登录
        <i class="custom-block-btn-bg"><img src="~@/assets/image/img/block-btn-bg@2x.png"></i>
      </div>
      <!-- 未登录 -->
      <div v-if="!isLogined" class="line-btn-box">
        <p @click="toLogin" class="custom-small-btn left-btn">
                          登录
          <i class="custom-small-btn-bg"><img src="~@/assets/image/img/btn-bg.png"></i>
        </p>
        <p @click="toReg" class="custom-small-btn right-btn">
                            注册
          <i class="custom-small-btn-bg"><img src="~@/assets/image/img/btn-bg.png"></i>
        </p>
      </div>
    </div>
    <!--修改昵称弹窗-->
    <van-dialog
      v-model="showDialog"
      title="修改用户名"
      :beforeClose="dialogConfirm"
      show-cancel-button>
      <van-field class="dialog-input" type="inputLists[0].type" v-model="inputLists[0].value" :placeholder="inputLists[0].placeholder" />
      <p class="remark-text" v-if="inputLists[0].ramks" v-text="inputLists[0].ramks"></p>
    </van-dialog>
  </div>
</template>

<script>
import MainHeader from '@/components/Main/Header';
import { Cell, Toast, Dialog, Field } from 'vant';
import { mapState, mapActions, mapGetters } from 'vuex';
import { byteLen } from '@/utils/utils';
import * as BASE from '@/service/base';
import ClipboardJS from 'clipboard';

export default {
  name: 'my',
  components: {
    MainHeader,
    [Cell.name]: Cell,
    [Toast.name]: Toast,
    [Dialog.Component.name]: Dialog.Component,
    [Field.name]: Field,
    [Dialog.Component.name]: Dialog.Component
  },
  data() {
    return {
      headerObj: {
        fixed: true,
        title: '我的'
      },
      appConfig: {},
      // token
      nickname: '用户昵称',
      bossAuthText: {
        0: '未申请',
        1: '已申请'
      },
      updateName: '',
      nickMaxLen: 16,
      // 弹框
      showDialog: false,
      inputLists: [
        { placeholder: '', value:'', type:'text', ramks: '' },
      ]
    };
  },
  created() {
    this.nickname = this.userInfo.m_nick_name;
    this.getConfig();
  },
  watch: {
    userInfo() {
      this.nickname = this.userInfo.m_nick_name;
    },
    isLogined(nval, oval){
    }
  },
  computed: {
    ...mapState('sign', {
      userInfo: state => state.userInfo
    }),
    ...mapGetters('sign', [
      'isLogined'
    ]),
  },
  mounted() {
  },
  methods: {
    ...mapActions('sign', [
      'LogOut',
      'UpdateAccData'
    ]),
    getConfig() {
      this.$api.common.configInfo().then(res => {
        console.log(res);
        if(res.data.result){
          let result = res.data.result;
          this.appConfig = result;
        }
      });
//    var self = this;
//    $ws.Ajax({
//        wsName: 'common/config',
//    }, function(ret) {
//      if(ret && ret.result){
//        var result = ret.result;
//        self.adminConfigMap = result;
//        self.customerInfo = result.customerInfo;
//      }else{
//        err(self.LAN(ret.msg));
//      }
//    });
    },
    updateNicknameBefore() {
      this.showDialog = true;
      this.inputLists = [
        {placeholder:'请输入<8位汉字或<16位英文', value:'', type:'text', ramks: '支持中文,字母,数字,下划线,减号'}
      ];
    },
    dialogConfirm(action, done) {
      this.updateName = this.inputLists[0].value;
      // 只含有汉字、数字、字母、下划线,减号,位置不限
      let nicknameReg = /^[a-zA-Z0-9_\u4e00-\u9fa5\-]{1,16}$/;

      // 计算字节
      let byteLength = byteLen(this.updateName);
      
      if (action === 'confirm') {
        if (byteLength > this.nickMaxLen) {
          Toast('用户名不能超过' + this.nickMaxLen / 2 + '位汉字或' + this.nickMaxLen + '位英文');
          done(false);
        } else if (!nicknameReg.test(this.updateName)) {
          Toast('用户名格式不正确');
          done(false);
        } else {
          this.$api.my.updataNickname({
            m_nick_name: this.updateName
          }).then(res => {
            console.log(res);
            // let result = res.data.result;
            setTimeout(done, 1000);
            this.$store.dispatch('sign/UpdateAccData');
            Toast('修改成功');
          }).catch(error => {
            done(false);
            Toast(this.$t(`lang.system.${error.data.msg}`));
          });
        }
      } else {
        done();
      }
    },
    loginOut() {
      this.$store.dispatch('sign/LogOut')
        .then((res) => {
          Toast('退出成功');
        }).catch((error) => {
          Toast(this.$t(`lang.system.${error.data.msg}`));
        });
    },
    toInvite() {
      this.$router.togo('/my/invite');
    },
    toMyOrder() {
      this.$router.togo('/order/list');
    },
    toService() {
      let self = this;
      let clipboard = new ClipboardJS('.copy')
        .on('success', e => {
          Dialog.confirm({
            title: '客服联系方式',
            message: self.appConfig.customerInfo,
            confirmButtonText: '复制'
          }).then(() => {
            Toast(e.text + '复制成功');
          }).catch(() => {
          });
          e.clearSelection();
          clipboard.destroy();
        });
    },
    toOnlineFK() {
      this.$router.togo({
        name: 'other/iframe',
        query: {
          title: '在线客服',
          toUrl: 'https://kefu.easemob.com/webim/im.html?configId=887e972e-b091-44de-b77a-2732ac955815'
        }
      });
    },
    toLogin() {
      this.$router.togo('/login');
    },
    toReg() {
      this.$router.togo('/register');
    },
    toSecurity() {
      this.$router.togo('/my/security');
    },
    toHelp() {
      this.$router.togo('/my/help');
    },
    toDownload() {
      this.$router.togo({
        name: 'other/iframe',
        query: {
          title: 'Mpay下载',
          toUrl: BASE.DomainUrl
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.nav-top{
  margin-top: 54px;
}
.top-card{
  display: flex;
  min-height: 125px;
  margin-left: 16px;
  margin-right: 16px;
  justify-content: flex-start;
  align-items: center;
  background: url("~@/assets/image/img/visiting-card.png") no-repeat center;
  background-size: 100%;
}
.logo-area{
  width: 60px;
  height: 60px;
  margin-left: 14%;
}
.name-area{
  margin-left: 7%;
  text-align: left;
  .username{
    margin-bottom: 10px;
    font-size: 17px;
    font-weight: bold;
  }
  span{
    vertical-align: text-top;
    i{
      margin-left: 10px;
      color: #fff;
    }
  }
}

.list-item{
  margin: 15px 0;
}

.tabbar-bottom{
  margin-bottom: 70px;
}
</style>
<style lang="less">
@import "~@/assets/css/input_dialog.less";
.my-wrapper{
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
