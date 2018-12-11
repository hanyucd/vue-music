<template>
  <transition name="drop">
    <div id="top_tip" v-show="showFlag" @click.stop="hide">
      <slot></slot>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    delay: {
      type: Number,
      default: 2000
    }
  },
  data() {
    return {
      showFlag: false
    };
  },
  methods: {
    show() {
      this.showFlag = true;

      clearTimeout(this.timer);
      // 2 秒后自动关闭
      this.timer = setTimeout(() => {
        this.hide();
      }, this.delay);
    },
    hide() {
      this.showFlag = false;
    }
  }
};
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/const.scss';

  #top_tip {
    position: fixed;
    top: 0;
    width: 100%;
    background: $color-dialog-background;
  }

  .drop-enter, .drop-leave-to {
    transform: translate3d(0, -100%, 0);
  }
  .drop-enter-active, .drop-leave-active {
    transition: all .5s;
  }
</style>
