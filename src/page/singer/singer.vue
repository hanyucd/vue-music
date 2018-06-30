<template>
  <div>
    {{ msg }}
  </div>
</template>

<script>
export default {
  data () {
    return {
      msg: '歌手'
    };
  }
};
</script>

<style lang="scss" scoped>
  @import './singer.scss';
</style>
