<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from 'better-scroll';

export default {
  props: {
    // 派发 scroll 事件
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    },
    // 是否监听滚动位置
    listenScroll: {
      type: Boolean,
      default: false
    },
    // 是否开启上拉加载
    pullup: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    // 监听 data
    data() {
      setTimeout(() => {
        this.refresh();
      }, 20);
    }
  },
  mounted() {
    setTimeout(() => {
      this._initScroll();
    }, 20);
  },
  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        return;
      }

      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      });
      // 监听 better-scroll 滚动事件 | 派发自定义事件
      if (this.listenScroll) {
        let self = this;
        // better-scroll 滚动时触发
        this.scroll.on('scroll', (pos) => {
          // 向父组件派发事件
          self.$emit('scroll', pos);
        });
      }

      if (this.pullup) {
        // better-scroll 滚动结束时（滚动到底部）触发
        this.scroll.on('scrollEnd', () => {
          if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
            // 向父组件派发事件
            this.$emit('scrollToEnd');
          }
        });
      }
    },
    enable() {
      // 启用 better-scroll
      this.scroll && this.scroll.enable();
    },
    disable() {
      // 禁用 better-scroll
      this.scroll && this.scroll.disable();
    },
    refresh() {
      // 重新计算 better-scroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常
      this.scroll && this.scroll.refresh();
    },
    scrollTo() {
      // 滚动到指定的位置
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    },
    scrollToElement() {
      // 滚动到指定的目标元素
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
