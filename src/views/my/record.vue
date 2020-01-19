<template>
  <div>
    <van-nav-bar
      :title="headerObj.title"
      left-arrow
      :fixed="headerObj.fixed"
      @click-left="back"
    />
    <!-- 充值提现 -->
    <van-row v-if="$route.params.title === 'topUp' || $route.params.title === 'withdraw'" class="nav-top table-title">
      <van-col span="8">时间</van-col>
      <van-col span="8">数量</van-col>
      <van-col span="8">状态</van-col>
    </van-row>
    <van-row v-if="$route.params.title === 'invest'" class="nav-top table-title">
      <van-col span="6">投资天数</van-col>
      <van-col span="6">使用kiwi</van-col>
      <van-col span="6">使用ceo</van-col>
      <van-col span="6">时间</van-col>
    </van-row>
    <van-row v-if="$route.params.title === 'incubator'" class="nav-top table-title">
      <!-- <van-col span="6">释放基准</van-col> -->
      <van-col span="8">释放比例</van-col>
      <van-col span="8">收益kiwi</van-col>
      <van-col span="8">时间</van-col>
    </van-row>
    <van-row v-if="$route.params.title === 'introduce'" class="nav-top table-title">
      <van-col span="8">粉丝</van-col>
      <van-col span="8">收益kiwi</van-col>
      <van-col span="8">时间</van-col>
    </van-row>
    <pagination :data="tableData" @getList="getRecordList" @returnList="returnList">
      <!-- 充值提现 -->
      <div v-if="$route.params.title === 'topUp' || $route.params.title === 'withdraw'">
        <van-row class="table-row" v-for="(item, index) in list" :key="index">
          <van-col span="8">{{item.t_timereceived}}</van-col>
          <van-col span="8">{{item.t_amount}}</van-col>
          <van-col span="8">{{keyValue.recordStatus[String(item.w_status)]}}</van-col>
        </van-row>
      </div>
      <div v-if="$route.params.title === 'invest'">
        <van-row class="table-row" v-for="(item, index) in list" :key="index">
          <van-col span="6">{{keyValue.investType[String(item.invest_type)]}}</van-col>
          <van-col span="6">{{item.amount}}</van-col>
          <van-col span="6">{{item.fee_amount}}</van-col>
          <van-col span="6">{{item.created_time}}</van-col>
        </van-row>
      </div>
      <div v-if="$route.params.title === 'incubator'">
        <van-row class="table-row" v-for="(item, index) in list" :key="index">
          <!-- <van-col span="6">{{item.amount}}kiwi</van-col> -->
          <van-col span="8">{{new Decimal(item.rate).mul(100)}}%</van-col>
          <van-col span="8">{{item.unfrozen_num}}</van-col>
          <van-col span="8">{{item.created_time}}</van-col>
        </van-row>
      </div>
      <div v-if="$route.params.title === 'introduce'">
        <van-row class="table-row" v-for="(item, index) in list" :key="index">
          <van-col span="8">{{item.name}}</van-col>
          <van-col span="8">{{item.separate}}</van-col>
          <van-col span="8">{{item.createdTime}}</van-col>
        </van-row>
      </div>
    </pagination>
  </div>
</template>

<script>
import { NavBar, Row, Col } from "vant";
import Pagination from "@/components/Pagination/Pagination";
import keyValue from "@/config/keyValue.js";
const Decimal = require("decimal.js");

const config = {
  topUp: "充值记录",
  withdraw: "提现记录",
  invest: "资产记录",
  incubator: "孵化器收益记录",
  introduce: "分享收益记录"
};
export default {
  name: "",
  components: {
    [NavBar.name]: NavBar,
    [Row.name]: Row,
    [Col.name]: Col,
    Pagination
  },
  data() {
    return {
      headerObj: {
        fixed: true,
        title: "投资记录"
      },
      // 分页数据
      tableData: {},
      // 列表数据
      list: [],
      keyValue: keyValue,
      Decimal: Decimal
    };
  },
  created() {},
  mounted() {
    this.getRecordList({ pageNum: 1, pageSize: 10 });
    this.headerObj.title = config[this.$route.params.title];
  },
  watch: {},
  computed: {},
  methods: {
    back() {
      this.$router.goBack();
    },
    async getRecordList(param) {
      let res = {};
      if (this.$route.params.title === "invest") {
        res = await this.$api.my.getInvestRecord({
          page: param.pageNum || 0,
          pageSize: param.pageSize || 10
        });
        this.tableData = res.data.result.interestVOList;
        this.list = res.data.result.interestVOList.list;
      } else if (
        this.$route.params.title === "topUp" ||
        this.$route.params.title === "withdraw"
      ) {
        res = await this.$api.my.getRecord({
          symbol: this.$route.params.symbol,
          type: this.$route.params.type,
          page: param.pageNum || 0,
          pageSize: param.pageSize || 10
        });
        this.tableData = res.data.result;
        this.list = res.data.result.list;
      } else if (this.$route.params.title === "incubator") {
        res = await this.$api.my.getReleaseRecord({
          type: 1,
          page: param.pageNum || 0,
          pageSize: param.pageSize || 10
        });
        this.tableData = res.data.result.unFrozenList;
        this.list = res.data.result.unFrozenList.list;
      } else if (this.$route.params.title === "introduce") {
        res = await this.$api.my.getBenefitRecord({
          type: 3,
          page: param.pageNum || 0,
          pageSize: param.pageSize || 10
        });
        this.tableData = res.data.result.separateVOList;
        this.list = res.data.result.separateVOList.list;
      }
    },
    // 列表返回数据
    returnList(list) {
      this.list = list;
    }
  },
  destroyed() {}
};
</script>

<style lang="less" scoped>
.table-title,
.table-row {
  padding: 0 10px;
}
.table-title {
  text-align: center;
  height: 40px;
  line-height: 40px;
  background: #273338;
}
.table-row {
  padding: 5px 0;
  text-align: center;
  border-bottom: 1px solid #152b33;
  .van-col {
    line-height: 1.5;
  }
}
</style>

<style lang="less">
</style>
