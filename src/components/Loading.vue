<template>
  <div class="loading">
    <img src="~@/assets/image/loading/loading.gif" alt="">
  </div>
</template>

<script>
export default {
  name: 'Loading',
  components: {
  },
  data() {
    return {
    };
  },
  created() {},
  mounted() {},
  methods: {}
};
</script>

<style lang="less" scoped>
.loading{
  position: fixed;
  top:0;
  left:0;
  z-index:121;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.3);
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}
.loading img{
  width: 1rem;
  height: 1rem;
  margin:7.5rem auto;
}
</style>

<style lang="less">
</style>
