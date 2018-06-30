<template>
  <div>
    {{ msg }}
  </div>
</template>

<script>
export default {
  data () {
    return {
      msg: '搜索'
    };
  }
};
</script>

<style lang="scss" scoped>
  @import './search.scss';
</style>
