<template>
  <div id="no-result">
    <div class="icon"></div>
    <p class="text">{{ title }}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '抱歉，暂无数据~'
    }
  }
};
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/const.scss';
  @import '@/assets/scss/mymixin.scss';

  #no-result {
    text-align: center;
    .icon {
      width: 86px;
      height: 90px;
      margin: 0 auto;
      @include bg-image('no-result');
      background-size: 86px 90px;
    }
    .text {
      margin-top: 30px;
      font-size: $font-size-medium;
      color: $color-text-d;
    }
  }
</style>
