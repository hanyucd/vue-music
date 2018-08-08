<template>
  <transition name="slide">
    <music-list :title="title" :bgImage="bgImage" :songs="songs" :rank="true"></music-list>
  </transition>
</template>

<script>
import MusicList from '@/components/music_list/music_list';

import { getRankDetail } from '@/api/rank';

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
      'rankList'
    ]),
    title() {
      return this.rankList.topTitle;
    },
    bgImage() {
      if (this.songs.length) {
        // 返回第一首歌曲图片
        return this.songs[0].image;
      }
      return '';
    }
  },
  created() {
    this._fetchRankDetail();
  },
  methods: {
    /*
     * 获取指定排行榜单详情
     */
    _fetchRankDetail() {
      // 禁止直接刷新详情页（获取不到排行 id）
      if (!this.rankList.id) {
        this.$router.push('/rank');
        return;
      }

      getRankDetail(this.rankList.id).then(res => {
        if (res.code === 0) {
          this.songs = this._formatSongs(res.songlist);
        }
      });
    },
    /*
     * 重组 res.songlist 数据
     */
    _formatSongs(list) {
      let result = [];

      list.forEach(item => {
        let musicData = item.data;
        if (musicData.songid && musicData.albummid) {
          createSong(musicData).then(data => {
            result.push(data);
          });
        }
      });
      return result;
    }
  }
};
</script>

<style lang="scss" scoped>
  @import './rank_detail.scss';
</style>
