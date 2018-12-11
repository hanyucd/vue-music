<template>
  <transition name="addSong">
    <div id="add_song" v-show="showFlag" @click.stop>
      <!-- 头部 -->
      <section class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click.stop="hide">
          <i class="icon-close"></i>
        </div>
      </section>

       <!-- 搜索框 -->
      <section class="search-box-wrapper">
      </section>

      <!-- 切换区块 -->
      <section class="shortcut">
      </section>

      <!-- 搜索区块 -->
      <section class="search-result">
      </section>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      showFlag: false
    };
  },
  methods: {
    show() {
      this.showFlag = true;
    },
    hide() {
      this.showFlag = false;
    }
  }
};
</script>

<style lang="scss" scoped>
  @import './add_song.scss';
</style>
