<template>
  <div id="music_list">
    <!-- 返回按钮 -->
    <article class="back">
      <i class="icon-back"></i>
    </article>
    <!-- 顶部歌手名字 -->
    <h1 class="title" v-html="title"></h1>

    <section class="bg-image" :style="bgStyle">
      <!-- 蒙层 -->
      <div class="filter"></div>
    </section>
  </div>
</template>

<script>
export default {
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
  }
};
</script>

<style lang="scss" scoped>
  @import './music_list.scss';
</style>
