<template>
  <div>
    {{ msg }}
  </div>
</template>

<script>
export default {
  data () {
    return {
      msg: '排行榜'
    };
  }
};
</script>

<style lang="scss" scoped>
  @import './rank_list.scss';
</style>
