<template>
  <div class="wxlogin-wrapper">
  </div>
</template>

<script>
import { Toast } from 'vant';
import { WxAuthConfig } from '@/service/base';
import * as $util from '@/utils/utils';
import { mapState, mapActions } from 'vuex';

export default {
  name: '',
  components: {
  },
  data() {
    return {
      code: $util.getParam('code'),
      state: $util.getParam('state')
    };
  },
  created() {},
  mounted() {
    this.wxLogin();
  },
  watch: {},
  computed: {},
  methods: {
    ...mapActions('sign', [
      'WxLogin'
    ]),
    wxLogin() {
      if(this.code) {
        let params = {
          code: this.code,
          state: this.state
        }
        this.$store.dispatch('sign/WxLogin', params)
          .then(res => {
            // this.$router.goBack();
            window.history.go(-2);
          })
      } else {
        Toast("用户未授权");
        setTimeout(() => {
          this.$router.goBack(-3);
        },2000);
      }
    }
  },
  destroyed() {}
};
</script>

<style lang="less" scoped>
</style>

<style lang="less">
</style>
