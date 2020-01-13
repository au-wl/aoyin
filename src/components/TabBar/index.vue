<template>
  <van-tabbar
    v-model="active"
    @change="switchBar">
    <van-tabbar-item
      v-for="(item,index) in tabbar"
      :name="item.name"
      :key="index"
      replace
      :to="item.path"
      :icon="item.meta.icon">{{item.meta.title}}</van-tabbar-item>
  </van-tabbar>
</template>

<script>
import { Tabbar, TabbarItem } from 'vant';

export default {
  name: 'TabBar',
  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem
  },
  data() {
    return {
      active: '',
      tabbar: []
    };
  },
  watch: {
    $route(to, from) {
      this.active = this.$route.name;
    }
  },
  created() {
    this.tabbar = this.$router.options.routes.filter((val, index) => {
      if (val.name === 'main') {
        return val;
      }
    })[0].children;
    this.active = this.firstTabItem;
  },
  mounted() {
    this.active = this.$route.name;
  },
  computed: {
    firstTabItem() {
      return this.tabbar[0].name;
    }
  },
  methods: {
    switchBar(active) {
      this.active = active;
    }
  }
};
</script>

<style lang="less" scoped>
[class*=van-hairline]::after{
  border: 0 solid transparent;
  box-shadow: 0px 2px 12px 0px rgba(29,165,181,0.6);
}
</style>
