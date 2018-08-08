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
      'rankList'
    ]),
    title() {
      return this.rankList.topTitle;
    },
    bgImage() {
      return this.rankList.picUrl;
    }
  }
};
</script>

<style lang="scss" scoped>
  @import './rank_detail.scss';
</style>
