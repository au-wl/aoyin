<template>
  <div class="iframe-wrapper">
    <van-nav-bar
      :title="headerObj.title"
      left-arrow
      :fixed="headerObj.fixed"
      @click-left="back"
    />
    <iframe style="padding-top:50px;" :src="toUrl"></iframe>
  </div>
</template>

<script>
import { NavBar } from 'vant';

export default {
  name: '',
  components: {
    [NavBar.name]: NavBar
  },
  data() {
    return {
      headerObj: {
        fixed: true,
        title: ''
      },
      toUrl: ''
    };
  },
  created() {
    this.headerObj.title = this.$route.query.title;
    this.toUrl = this.$route.query.toUrl;
  },
  mounted() {
  },
  watch: {},
  computed: {},
  methods: {
    back() {
      this.$router.goBack();
    }
  },
  destroyed() {}
};
</script>

<style lang="less" scoped>
body,html,.iframe-wrapper{
  height: 100%;
  width: 100%;
}
iframe{
  width:100%;
  height:100%;
  border: none;
}
</style>

<style lang="less">
</style>
