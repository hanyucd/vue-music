<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage"></music-list>
  </transition>
</template>

<script>
import MusicList from '@/components/music_list/music_list';
import { getSongList } from '@/api/recommend';

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
  },
  created() {
    this._getSongList();
  },
  methods: {
    // 获取歌单数据
    _getSongList() {
      getSongList(this.songList.dissid)
        .then(res => {
          if (res.code === 0) {
            console.log('hanyu:', res.cdlist[0].songlist);
          }
        });
    }
  }
};
</script>

<style lang="scss" scoped>
  @import './recommend_songList.scss';
</style>
