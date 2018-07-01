<template>
  <div id="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <!-- 轮播点 -->
    <div class="dots">
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
    return {};
  },
  mounted() {
    setTimeout(() => {
      this._setSliderWidth();
      this._initSlider();
    }, 20);
  },
  methods: {
    /*
      BetterScroll：横向滚动，相比纵向滚动需要 动态的 去获取滚动区的 宽度
      动态设置轮播图 (sliderGroup) 宽度
    */
    _setSliderWidth() {
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

      if (this.loop) {
        width += 2 * sliderWidth;
      }
      this.$refs.sliderGroup.style.width = width + 'px';
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
          speed: 1000 // 滚动速率 1s
        },
        click: true // 允许点击 | 触发原生事件
      });
    }
  }
};
</script>

<style lang="scss" scoped>
  @import './slider.scss';
</style>
