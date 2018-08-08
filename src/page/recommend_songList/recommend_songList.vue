<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
import MusicList from '@/components/music_list/music_list';
import { getSongList } from '@/api/recommend';
import { createSong } from '@/assets/js/song';

import { mapGetters } from 'vuex';

export default {
  components: {
    MusicList
  },
  data() {
    return {
      songs: []
    };
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
      if (!this.songList.dissid) {
        this.$router.push('/recommend');
        return;
      }

      getSongList(this.songList.dissid)
        .then(res => {
          if (res.code === 0) {
            this.songs = this._formatSongs(res.cdlist[0].songlist);
          }
        });
    },
    /*
     * 重组 res.cdlist[0].songlist 数据
     */
    _formatSongs(list) {
      let result = [];

      list.forEach(item => {
        if (item.songid && item.albummid) {
          createSong(item).then(res => {
            result.push(res);
          });
        }
      });

      return result;
    }
  }
};
</script>

<style lang="scss" scoped>
  @import './recommend_songList.scss';
</style>
