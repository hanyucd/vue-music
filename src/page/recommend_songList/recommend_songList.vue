<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage"></music-list>
  </transition>
</template>

<script>
import MusicList from '@/components/music_list/music_list';
import { mapGetters } from 'vuex';

export default {
  components: {
    MusicList
  },
  computed: {
    ...mapGetters([
      'songList'
    ]),
    // 传入子组件
    title() {
      return this.songList.dissname;
    },
    // 传入子组件
    bgImage() {
      return this.songList.imgurl;
    }
  }
};
</script>

<style lang="scss" scoped>
  @import './recommend_songList.scss';
</style>
