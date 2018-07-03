<template>
  <div id="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <!-- 轮播点 -->
    <div class="dots">
      <span class="dot" v-for="(item, index) in dots" :key="index" :class="{ acitve: currentPageIndex === index }"></span>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll';
import { domAddClass } from '@/assets/js/dom';

export default {
  props: {
    // 是否循环播放
    loop: {
      type: Boolean,
      default: true
    },
    // 是否自动播放
    autoPlay: {
      type: Boolean,
      default: true
    },
    // 轮播延时
    delay: {
      type: Number,
      default: 3000
    }
  },
  data() {
    return {
      dots: [], // 轮播点
      currentPageIndex: 0
    };
  },
  mounted() {
    setTimeout(() => {
      this._setSliderWidth();
      this._initDots();
      this._initSlider();

      if (this.autoPlay) {
        this._play();
      }

      let self = this;
      // 监听窗口大小发生变化事件
      window.addEventListener('resize', function() {
        if (!self.slider) return;

        self._setSliderWidth(true);
        // 重新计算 better-scroll
        self.slider.refresh();
      });
    }, 20);
  },
  destroyed() {
    // 良好的习惯：销毁定时器
    clearTimeout(this.timer);
  },
  methods: {
    /*
      BetterScroll：横向滚动，相比纵向滚动需要 动态的 去获取滚动区的 宽度
      动态设置轮播图 (sliderGroup) 宽度
    */
    _setSliderWidth(isResize) {
      // 取出父元素节点 中 所有子元素节点集合
      this.childrenList = this.$refs.sliderGroup.childNodes;
      // console.log(this.childrenList) // (arr.length) [div, div, div, div, div]
      let width = 0;
      // 返回内容的可视宽度（不包括边框，边距或滚动条）
      let sliderWidth = this.$refs.slider.clientWidth;

      for (let i = 0; i < this.childrenList.length; i++) {
        let childDom = this.childrenList[i];
        // 动态向 dom 中添加 class
        domAddClass(childDom, 'slider-item');
        childDom.style.width = sliderWidth + 'px';
        // 累加单个 dom 宽度
        width += sliderWidth;
      }

      if (this.loop && !isResize) {
        width += 2 * sliderWidth;
      }
      this.$refs.sliderGroup.style.width = width + 'px';
    },
    // 初始化 轮播点个数
    _initDots() {
      // 初始化一个 有长度的 空数组
      this.dots = new Array(this.childrenList.length);
    },
    // 自动播放
    _play() {
      let nextPage = this.currentPageIndex + 1;

      this.timer = setTimeout(() => {
        // 滚动到指定的页面
        this.slider.goToPage(nextPage, 0, 500);
      }, this.delay);
    },
    // 初始化 better-scroll
    _initSlider() {
      let self = this;
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true, // 开启横向滚动
        scrollY: false, // 关闭纵向滚动
        momentum: false, // 关闭滚动动画
        snap: {
          loop: self.loop, // 支持循环轮播
          threshold: 0.3, // 表示可滚动到下一个的阈值
          speed: 500 // 滚动速率 1s
        }
      });
      // better-scroll 监听滚动结束事件
      this.slider.on('scrollEnd', () => {
        // pageX 表示横轴方向的页面数
        let nowIndex = this.slider.getCurrentPage().pageX;

        this.currentPageIndex = nowIndex;

        if (this.autoPlay) {
          // 先清除掉第一次的 定时器
          clearTimeout(this.timer);
          this._play();
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
  @import './slider.scss';
</style>
