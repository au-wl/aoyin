<template>
  <van-tabbar v-model="active">
    <van-tabbar-item
      v-for="(item,index) in tabbar"
      :key="index"
      replace
      :to="item.path"
      :icon="item.meta.icon">{{item.meta.title}}</van-tabbar-item>
  </van-tabbar>
</template>

<script>
import { Tabbar, TabbarItem } from 'vant';

export default {
  name: 'NavBar',
  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem
  },
  data() {
    return {
      active: 0,
      tabbar: []
    };
  },
  created() {
    this.tabbar = this.$router.options.routes[0].children
  }
};
</script>

<style lang="less" scoped>
.van-tabbar{
  background: @nav-bar-background-color;
}
.van-tabbar-item{
  color: @nav-bar-title-text-color;
}
.van-tabbar-item--active{
  color: @nav-bar-text-color;
}

</style>
