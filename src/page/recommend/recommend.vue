<template>
  <div>
    {{ msg }}
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: '推荐'
    };
  }
};
</script>

<style lang="scss" scoped>
  @import './recommend.scss';
</style>
