<template>
  <div id="music_list">
    <!-- 返回按钮 -->
    <article class="back" @click="back">
      <i class="icon-back"></i>
    </article>
    <!-- 顶部歌手名字 -->
    <h1 class="title" v-html="title"></h1>
    <!-- 头部背景图片 -->
    <section class="bg-image" :style="bgStyle" ref="bgImage">
      <!-- 随机播放按钮 -->
      <article class="play-wrapper">
        <div class="play" v-show="songs.length > 0" ref="playBtn" @click="random">
          <i class="icon-play"></i>
          <span class="text">随机播放</span>
        </div>
      </article>
      <!-- 背景图片上 暗灰蒙层 -->
      <div class="filter"></div>
    </section>
    <!-- 歌曲列表上滑 推层上移效果 -->
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
        <song-list :songs="songs" :rank="rank" v-on:select="select"></song-list>
      </div>
      <!-- loading 组件 -->
      <article class="loading-container" v-show="!songs.length">
        <loading></loading>
      </article>
    </scroll>
  </div>
</template>

<script>
import Scroll from '@/components/scroll/scroll';
import Loading from '@/components/loading/loading';
import SongList from '@/components/song_list/song_list';

import { mapActions } from 'vuex';

import { playlistMixin } from '@/assets/js/mixin';

// 为推层预留顶部高度
const RESERVED_HEIGHT = 40;

export default {
  mixins: [
    playlistMixin
  ],
  components: {
    Scroll,
    Loading,
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
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scrollY: 0
    };
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
      let z_index = 0; // 声明背景图片层叠优先级
      let scale = 1; // 声明背景图片放大比例
      // 背景图 Dom
      let bgImageDom = this.$refs.bgImage;
      this.$refs.bgLayer.style['transform'] = `translate3d(0, ${ translateY }px, 0)`;

      // 计算下拉图片放大比例
      const percent = Math.abs(newY / this.imageHeight);
      if (newY > 0) {
        scale = 1 + percent;
        z_index = 10;
      }
      bgImageDom.style['transform'] = `scale(${ scale })`;

      // 如果歌曲列表上滑Y轴 小于 限制高度
      if (newY < this.minTranslateY) {
        z_index = 10;
        bgImageDom.style.paddingTop = 0;
        bgImageDom.style.height = `${ RESERVED_HEIGHT }px`;
        this.$refs.playBtn.style.display = 'none'; // 隐藏随机播放按钮
      } else {
        bgImageDom.style.paddingTop = '70%';
        bgImageDom.style.height = '0';
        this.$refs.playBtn.style.display = ''; // 显示随机播放按钮
      }
      bgImageDom.style.zIndex = z_index;
    }
  },
  created() {
    // 用于传递到子组件 scroll（better-scroll）中
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
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ]),
    /*
     * 监听子组件派发的事件 | better-scroll 滚动事件
     */
    scroll(pos) {
      this.scrollY = pos.y;
    },
    /*
     * 后退到上一级
     */
    back() {
      this.$router.back();
    },
    /*
     * 监听子组件(song-list)派发的事件 | 触发选择播放 (Actions)
     */
    select(item, index) {
      this.selectPlay({
        list: this.songs,
        index
      });
    },
    /*
     * 触发随机播放 (Actions)
     */
    random() {
      this.randomPlay({
        list: this.songs
      });
    },
    /*
     *当有迷你播放器时，调整滚动底部距离
     */
    handlePlaylist(playlist) {
      let bottom = playlist.length > 0 ? '60px' : '';
      this.$refs.list.$el.style.bottom = bottom;
      this.$refs.list.refresh();
    }
  }
};
</script>

<style lang="scss" scoped>
  @import './music_list.scss';
</style>
