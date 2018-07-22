<template>
  <div id="music_list">
    <!-- 返回按钮 -->
    <article class="back">
      <i class="icon-back"></i>
    </article>
    <!-- 顶部歌手名字 -->
    <h1 class="title" v-html="title"></h1>
    <!-- 头部背景图片 -->
    <section class="bg-image" :style="bgStyle" ref="bgImage">
      <!-- 背景暗灰蒙层 -->
      <div class="filter"></div>
    </section>
    <!-- 推层 -->
    <section class="bg-layer" ref="bgLayer"></section>

    <scroll
      class="list"
      ref="list"
      v-on:scroll="scroll"
      :data="songs"
      :probeType="probeType"
      :listenScroll="listenScroll"
     >
      <div class="song-wrapper">
        <song-list :songs="songs"></song-list>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from '@/components/scroll/scroll';
import SongList from '@/components/song_list/song_list';

// 为推层预留顶部高度
const RESERVED_HEIGHT = 40;

export default {
  components: {
    Scroll,
    SongList
  },
  props: {
    // 背景图
    bgImage: {
      type: String,
      default: ''
    },
    // 歌曲列表
    songs: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      scrollY: 0
    }
  },
  computed: {
    bgStyle() {
      return `background-image: url('${ this.bgImage }')`;
    }
  },
  watch: {
    scrollY(newY) {
      // 固定推层 Y 轴上限为背景图片可视高度
      let translateY = Math.max(this.minTranslateY, newY);
      this.$refs.bgLayer.style['transform'] = `translate3d(0, ${ translateY }px, 0)`;
    }
  },
  created() {
    this.probeType = 3;
    this.listenScroll = true;
  },
  mounted() {
    // 记录背景图可视区高度
    this.imageHeight = this.$refs.bgImage.clientHeight;
    this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT;
    // $el | Vue 实例使用的 DOM 元素
    this.$refs.list.$el.style.top = `${ this.$refs.bgImage.clientHeight }px`;
  },
  methods: {
    /*
     * 监听子组件派发的事件 | better-scroll 滚动事件
     */
    scroll(pos) {
      this.scrollY = pos.y;
      console.log(this.scrollY);
    }
  }
};
</script>

<style lang="scss" scoped>
  @import './music_list.scss';
</style>
