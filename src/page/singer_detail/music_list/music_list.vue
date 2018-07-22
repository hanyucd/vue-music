<template>
  <div id="music_list">
    <!-- 返回按钮 -->
    <article class="back">
      <i class="icon-back"></i>
    </article>
    <!-- 顶部歌手名字 -->
    <h1 class="title" v-html="title"></h1>

    <section class="bg-image" :style="bgStyle" ref="bgImage">
      <!-- 蒙层 -->
      <div class="filter"></div>
    </section>

    <scroll
      class="list"
      :data="songs"
      ref="list"
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
  computed: {
    bgStyle() {
      return `background-image: url('${ this.bgImage }')`;
    }
  },
  mounted() {
    // $el | Vue 实例使用的 DOM 元素
    this.$refs.list.$el.style.top = `${ this.$refs.bgImage.clientHeight }px`;
  }
};
</script>

<style lang="scss" scoped>
  @import './music_list.scss';
</style>
