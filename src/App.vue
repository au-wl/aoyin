<template>
  <div id="app">
    <loading v-show="LOADING"></loading>
    <transition :name="transitionName">
      <router-view class="Router"/>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { getURLParams } from '@/utils/utils';
import Loading from '@/components/Loading';
export default {
  name: 'App',
  components: {
    Loading
  },
  data () {
    return {
      transitionName: '',
      pagesDictionaries: {
        'mpayPayPage': '/other/mpay'
      }
    };
  },
  mounted() {
    let params = getURLParams();
    // console.log(params);
    if(params){
      if(params.page){
        let page = this.pagesDictionaries[params.page.split("#")[0]];
        this.$router.togo({
          path: page,
          query: {
            schemeParams: JSON.stringify(params)
          }
        });
      }
    }
  },
  watch: {
    $route(to, from) {
      if (this.$router.isleft) {
        this.transitionName = 'slideleft';
      };
      if (this.$router.isright) {
        this.transitionName = 'slideright';
      };
    }
  },
  computed: {
    ...mapState([
      'LOADING'
    ])
  }
};
</script>

<style lang="less">
@import url("~@/assets/css/common.less");
@import url("~@/assets/css/vantCover.less");

.Router {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background-color: @background-color;
  transition: all .5s ease;
  -webkit-transition: all .5s ease;
  -moz-transition: all .5s ease;
}
.slideleft-enter,
 .slideright-leave-active {
  opacity: 1;
  transform: translate3d(90% 0, 0);
  -webkit-transform: translate3d(90%, 0, 0);
  -moz-transform: translate3d(90%, 0, 0);
}
.slideleft-leave-active,
.slideright-enter {
 opacity: 1;
 transform: translate3d(-90% 0, 0);
 -webkit-transform: translate3d(-90%, 0, 0);
 -moz-transform: translate3d(-90%, 0, 0);
}
</style>
