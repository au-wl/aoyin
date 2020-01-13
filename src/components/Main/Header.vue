<template>
  <div>
    <van-nav-bar
      :left-text="leftText"
      :right-text="rightText"
      :fixed="fixed"
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
  </div>
</template>

<script>
import { Toast, NavBar } from 'vant';

export default {
  name: '',
  components: {
    [NavBar.name]: NavBar,
    [Toast.name]: Toast
  },
  props: {
    leftText: String,
    rightText: String,
    fixed: Boolean
  },
  data() {
    return {
    };
  },
  created() {},
  mounted() {},
  methods: {
    onClickLeft() {
      this.$emit('onClickLeft');
    },
    onClickRight() {
      this.$emit('onClickRight');
    }
  }
};
</script>

<style lang="less" scoped>
.van-nav-bar{
  margin-bottom: 10px;
}
.van-nav-bar__left{
  font-size: 20px;
  font-weight: bold;
}
[class*=van-hairline]::after{
  border: 0 solid transparent;
}
</style>
