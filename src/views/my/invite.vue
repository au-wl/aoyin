<template>
  <div class="invite-wrapper" style="visibility:hidden;">
    <van-nav-bar
      :title="headerObj.title"
      left-arrow
      :right-text="headerObj.bindState"
      :fixed="headerObj.fixed"
      @click-left="back"
      @click-right="showBindInviteCode"
    />
    <div class="conten nav-top">
      <van-cell @click="toShare" class="li-item" title="分享邀请链接" is-link />
      <van-cell-group title="专属邀请码">
        <van-cell @click="copy" class="copy" :data-clipboard-text="secode" :title="secode" value="复制邀请码" />
      </van-cell-group>
      <van-cell-group title="我的推荐">
        <van-row class="row-header" gutter="20">
          <van-col class="text-left" span="8">直推</van-col>
          <van-col span="8">二级</van-col>
          <van-col class="text-right" span="8">三级</van-col>
        </van-row>
        <van-list
          v-model="loading"
          :finished="finished"
          :offset="offset"
          @load="onLoad"
        >
          <van-row
            gutter="20"
            v-for="(item, index) in dataList"
            :key="index"
            class="custom-line"
            >
            <van-col class="text-left" span="8">{{item.secode||''}}</van-col>
            <van-col span="8">{{item.relevelnum||0}}</van-col>
            <van-col class="text-right" span="8">{{item.srelevelnum||0}}</van-col>
          </van-row>
        </van-list>
        <div v-if="dataList.length==0" class="empty-box">
          <div class="empty-img"><img src="~@/assets/image/loading/empty-logo@2x.png"></div>
           <p class="empty-text">{{emptyText}}</p>
        </div>
      </van-cell-group>
    </div>
    <!--绑定邀请码弹窗-->
    <van-dialog
      v-model="showBindCode"
      title="绑定邀请码"
      :beforeClose="dialogConfirm"
      show-cancel-button>
      <van-field class="dialog-input" v-model="inviteCode" placeholder="请输入邀请码" />
    </van-dialog>
  </div>
</template>

<script>
import ClipboardJS from 'clipboard';
import rules from '@/utils/rules';
import { NavBar, Cell, CellGroup, List, Toast, Row, Col, Dialog, Field } from 'vant';
import { say } from '@/utils/utils';
import { mapState, mapActions } from 'vuex';

export default {
  name: '',
  components: {
    [NavBar.name]: NavBar,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [List.name]: List,
    [Row.name]: Row,
    [Col.name]: Col,
    [Dialog.Component.name]: Dialog.Component,
    [Field.name]: Field
  },
  data() {
    return {
      headerObj: {
        fixed: true,
        title: '邀请好友',
        bindState: '绑定邀请码'
      },
      secode: '',
      inviteCode: '',
      // 弹框
      showBindCode: false,
      // 列表
      dataList: [],
      emptyText: '暂无数据',
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
  created() {
    this.secode = this.userInfo.secode;
  },
  mounted() {
    this.$el.style.visibility = 'visible';
    this.initHtml();
  },
  watch: {
  },
  computed: {
    ...mapState('sign', {
      userInfo: state => state.userInfo
    }),
    isBind() {
      return !!this.userInfo.parent_id;
    }
  },
  methods: {
    ...mapActions('sign', [
      'UpdateAccData'
    ]),
    initHtml() {
      if(this.isBind){
        this.headerObj.bindState = '已绑定';
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
        this.$api.my.recommendlList({
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
    showBindInviteCode() {
      if (!this.isBind) {
        this.showBindCode = true;
      }
    },
    dialogConfirm(action, done) {
      if (action === 'confirm') {
        if (this.inviteCode.length !== 6) {
          Toast('请输入6位数的邀请码');
          done(false);
        } else if (!rules.inviteCode.test(this.inviteCode)) {
          Toast('请输入格式正确的邀请码');
          done(false);
        } else {
          this.$api.my.bindCode({
            inviteCode: this.inviteCode
          }).then(res => {
            // let result = res.data.result;
            setTimeout(done, 1000);
            this.$store.dispatch('sign/UpdateAccData');
            say('绑定成功',1000);
          }).catch(error => {
            done(false);
            Toast(this.$t(`lang.system.${error.data.msg}`));
          });
        }
      } else {
        done();
      }
    },
    // 复制充值地址
    copy() {
      let clipboard = new ClipboardJS('.copy')
        .on('success', e => {
          Toast(e.text + '复制成功');
          e.clearSelection();
          clipboard.destroy();
        });
    },
    toShare() {
      this.$router.togo({
        name: 'share',
        query: {
          recode: this.secode
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
</style>

<style lang="less">
.invite-wrapper{
  .van-cell{
    padding: 20px 16px;
    font-size: 15px;
  }
  /*分组cell*/
  .van-cell-group{
    background-color: transparent;
  }
  .van-cell-group__title{
    padding: 16px;
  }
  .van-cell{
    background-color: #131F25 !important;
  }
  /*列表cell*/
  .van-row{
    height: 44px;
    line-height: 44px;
    margin-left: 0 !important;
    margin-right: 0 !important;
    padding: 0 16px;
    font-size: 16px;
    color: @main-color;
    text-align: center;
  }
  .row-header.van-row{
    color: @sub-color;
    background-color: #131F25;
  }
  /*弹窗*/
  .van-dialog{
    box-shadow: 0px 1px 20px 0px rgba(41,184,237,0.48) inset;
    background-color: #08121B;
    left: 49%;
  }
  .van-dialog__content{
    margin: 15px 10px 30px;
  }
  .dialog-input.van-cell{
    width: auto;
    margin: 10px 16px;
    padding: 12px 16px;
    border: 1px solid @main-color !important;
    background-color: transparent !important;
  }
  .van-dialog__header{
    padding: 20px 0 10px;
  }
  .van-button--default{
    background-color: transparent;
    color: @sub-color;
  }
  .van-dialog__confirm{
    color: @main-color;
  }
  /*end*/
}
</style>
