<template>
  <div>
    <router-view/>
    <TabBar></TabBar>
  </div>
</template>

<script>
import TabBar from '@/components/TabBar';

export default {
  name: 'mainLayout',
  components: {
    TabBar
  },
  mounted() {
  },
  data () {
    return {
    };
  }
};
</script>

<style lang="less" scoped>
@import url("~@/assets/css/common.less");
</style>
