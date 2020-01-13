<template>
  <div class="order-wrapper" style="visibility:hidden;">
    <van-nav-bar
      @click-left="back"
      :fixed="headerObj.fixed"
      left-arrow
      >
      <van-tabs
        slot="title"
        @change="switchTab">
        <van-tab
          v-for="(item,index) in tabList"
          :key="index"
          :name="item.val"
          :title="item.name">
        </van-tab>
      </van-tabs>
    </van-nav-bar>
    <!--列表-->
    <van-pull-refresh class="nav-top" v-model="isLoading" @refresh="onRefresh">
      <van-list
        v-model="loading"
        :finished="finished"
        :offset="offset"
        @load="onLoad">
        <div class="row-box"
          @click="toDetail(item)"
          v-for="(item,index) in filterDataList"
          :key="index">
          <!--doing-->
          <van-cell v-if="orderStatusDirection==1" :value="orderStatus[orderStatusDirection][item.pay_status]" is-link>
            <template slot="title">
              <i :class="orderDirectionObj[item.trans_type].clazz" class="direction-text">{{orderDirectionObj[item.trans_type].name}}</i>
              <span class="custom-title">{{item.symbol}}</span>
            </template>
          </van-cell>
          <!--done-->
          <van-cell v-else-if="orderStatusDirection==2" :value="orderStatus[orderStatusDirection][item.order_status]" is-link>
            <template slot="title">
              <i :class="orderDirectionObj[item.trans_type].clazz" class="direction-text">{{orderDirectionObj[item.trans_type].name}}</i>
              <span class="custom-title">{{item.symbol}}</span>
            </template>
          </van-cell>
          <van-cell title="下单时间" :value="item.pay_time" />
          <van-cell title="下单编号" :value="item.order_no" />
          <van-cell title="订单数量" :value="item.trade_num+' '+item.symbol" />
          <van-cell title="交易总额" :value="'￥ '+item.total_price" />
        </div>
      </van-list>
      <div v-if="dataList.length==0" class="empty-box">
        <div class="empty-img"><img src="~@/assets/image/loading/empty-logo@2x.png"></div>
         <p class="empty-text">{{emptyText}}</p>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script>
import { NavBar, Tab, Tabs, PullRefresh, List, Cell, Toast } from 'vant';

export default {
  name: 'otc',
  components: {
    [NavBar.name]: NavBar,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [List.name]: List,
    [PullRefresh.name]: PullRefresh,
    [Cell.name]: Cell,
    [Toast.name]: Toast
  },
  data() {
    return {
      headerObj: {
        fixed: true
      },
      tabList: [{
        name: '进行中',
        val: '1',
        showEmpty: false
      }, {
        name: '已完成',
        val: '2',
        showEmpty: true
      }],
      dataList: [],
      // 1 进行中  2 已完成
      orderStatusDirection: 1,
      orderDirectionObj: {
        1: {
          name: '售',
          clazz: 'sell-icontext'
        },
        2: {
          name: '购',
          clazz: 'buy-icontext'
        }
      },
      orderStatus: {
        1: {
          1: '待支付',
          2: '已支付',
          3: '已取消'
        },
        2: {
          2: '已完成',
          3: '已取消'
        }
      },
      emptyText: '暂无数据',
      //循环刷新
      onceLoading: false,
      seI_autoFn: null,//定时器
      autoFnIndex: 0,//定时器执行的次数，可判断执行某些东西
      totalItem: 0, //初始化总条数
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
  created() {},
  mounted() {
    this.orderStatusDirection = this.directionComputed;
    this.init();
  },
  watch: {},
  computed: {
    directionComputed: {
      get() {
        let firstItem = '';
        for (let i = 0, len = this.tabList.length; i < len; i++) {
          firstItem = this.tabList[0].val;
        }
        return firstItem;
      }
    },
    filterDataList() {
      let newArr = this.dataList.map((item, index, array) => {
        if (typeof item.payment_types === 'string') {
          item.payment_types = item.payment_types.split(',');
        }
        return item;
      });
      return newArr;
    }
  },
  methods: {
    init() {
      this.$el.style.visibility = 'visible';
    },
    //实时刷新
    autoFn() {
      var self=this;
      if (self.autoFnIndex < 2) {
        //你要执行的方法function()
        self.firstPage();
        self.autoFnIndex++;
      } else {
        self.autoFnIndex = 0;
      }
      //每次清空定时器
      clearTimeout(self.seI_autoFn);
      //定时器更新时间
      var refushTime = 5*1000;
      self.seI_autoFn = setTimeout(function() {
        self.autoFn();
      }, refushTime);
    },
    firstPage() {
      var self = this;
      var size;
      var totalPages = self.totalItem*1;

      if(totalPages<3){size = 30;};
      if(3<totalPages&&totalPages<=5){size = 50;};
      if(5<totalPages&&totalPages<=10){size = 100;};
      if(10<totalPages&&totalPages<=15){size = 150;};
      if(15<totalPages&&totalPages<=20){size = 200;};
      this.$api.order.orderList({
        orderStatusDirection: 1,
        currPage: 1,
        pageSize: this.pageSize
      }).then(res => {
        console.log(res);
        let result = res.data.result;
        let list = result.list;
        let len = list.length;
        for(var i=0; i<len; i++){
          if (this.orderStatusDirection === '1') {
            self.$set(this.dataList,i,list[i]);
          }
        }
        if(len==0){
          setTimeout(function(){
            if (this.orderStatusDirection === '1') {
              this.dataList = [];
            }
          },1000);
        }
      });
    },
    switchTab(name) {
      this.orderStatusDirection = name;
      this.pageNumber = 1;
      this.dataList = [];
      this.isLoading = false; //下拉加载
      this.loading = true;// 上拉加载中
      this.finished = false;// 上拉加载结束
      if (this.loading) {
        this.onLoad();
      }
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        this.pageNumber = 1;
        this.dataList = [];
        this.isLoading = false; //下拉加载
        this.loading = true;// 上拉加载中
        this.finished = false;// 上拉加载结束
        if (this.loading) {
          this.onLoad();
        }
      }, 500);
    },
    onLoad() {
      setTimeout(() => {
        this.$api.order.orderList({
          orderStatusDirection: this.orderStatusDirection,
          currPage: this.pageNumber,
          pageSize: this.pageSize
        }).then(res => {
          let result = res.data.result;
          this.loading = false;
          this.totalPage = result.pages;
          this.dataList = this.dataList.concat(result.list);
          console.log(result);
          // 实时刷新
          if (this.orderStatusDirection === '2'|| result.list.length === 0) { // 关闭实时刷新
            clearTimeout(this.seI_autoFn);
            this.seI_autoFn = null;
          } else { // 开启实时刷新
            this.totalItem = result.pages;
            this.autoFn();
          }
          if (this.pageNumber >= this.totalPage) {
            this.finished = true;
          }
          this.pageNumber++;
        });
      }, 500);
    },
    toDetail(row) {
      console.log(row);
      if (row.trans_type === '2') { // 买
        if (row.order_status === '1' && row.pay_status === '1') { // 付款给卖家
          this.$router.togo({
            name: 'doing/buyer',
            query: {
              id: row.id
            }
          });
        } else { // 订单状态
          this.$router.togo({
            name: 'done/buyer',
            query: {
              id: row.id,
              payStatus: row.pay_status,
              orderStatus: row.order_status
            }
          });
        }
      } else if (row.trans_type === '1') { // 卖
        if (row.order_status === '1' && row.pay_status === '1') { // 等待买家付款
          this.$router.togo({
            name: 'doing/seller',
            query: {
              id: row.id
            }
          });
        } else { // 订单状态
          this.$router.togo({
            name: 'done/seller',
            query: {
              id: row.id,
              receiveStatus: row.receive_status,
              payStatus: row.pay_status,
              orderStatus: row.order_status
            }
          });
        }
      }
    },
    back() {
      this.$router.goBack();
    }
  },
  destroyed() {
    clearTimeout(this.seI_autoFn);
    this.seI_autoFn = null;
  }
};
</script>

<style lang="less" scoped>
.row-box{
  box-shadow: 0px 1px 20px 0px rgba(41,184,237,0.48) inset;
  border-radius: 3px;
  margin-bottom: 20px;
}
.direction-text{
  margin-right: 5px;
  width: 19px;
  height: 19px;
  font-size: 16px;
  &.sell-icontext{
    color: #E96F6F;
  }
  &.buy-icontext{
    color: #03C086;
  }
}
</style>
<style lang="less">
/*覆盖vant样式*/
.order-wrapper {
  /*导航栏*/
  .van-nav-bar{
    height: 53px;
  }
  /*tab切换栏*/
  .van-tabs--line .van-tabs__wrap {
    height: 35px;
    margin-top: 12px;
    box-shadow: 0px 1px 20px 0px rgba(41, 184, 237, 0.48) inset;
    border-radius: 3px;
  }
  .van-tabs__nav {
    background-color: transparent;
  }
  [class*=van-hairline]::after {
    border: 0 solid transparent;
  }
  .van-tab {
    line-height: 35px;
    color: #096183;
  }
  .van-tab--active {
    color: @blue;
    font-weight: bold;
  }
  .van-tabs__line {
    height: 2px;
    background-color: @blue;
  }
  /*tab内容*/
  .van-pull-refresh {
    margin: 65px 16px 16px;
  }
  /*列表*/
 .van-cell{
   color: @sub-color !important;
 }
 .van-cell:not(:first-child)::after{
   border-bottom: 1px solid transparent;
 }
}
</style>
