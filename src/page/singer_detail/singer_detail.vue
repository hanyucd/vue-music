<template>
  <transition name="slide">
    <div id="singer_detail">
      {{ singer }}
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex';

import { getSingerDetail } from '@/api/singer';
import { ERROR_OK } from '@/api/config';
import { createSong } from '@/assets/js/song';

export default {
  data() {
    return {
      songs: []
    };
  },
  computed: {
    ...mapGetters([
      'singer'
    ])
  },
  created() {
    console.log(this.singer);
    this._fetchSingerDetail(this.singer.id);
  },
  methods: {
    /*
     * 获取指定歌手详情
     */
    _fetchSingerDetail(singerId) {
      // 禁止直接刷新页面（获取不到歌手 id）
      if (!this.singer.id) {
        this.$router.push({ path: '/singer' });
        return;
      }

      getSingerDetail(singerId).then(res => {
        if (res.code === ERROR_OK) {
          this.songs = this._normalizeSongs(res.data.list);
          console.log(this.songs);
        }
      });
    },
    /*
     * 重组歌手数据
     */
    _normalizeSongs(list) {
      let result = [];
      list.forEach(item => {
        let { musicData } = item;

        if (musicData.songid && musicData.albummid) {
          result.push(createSong(musicData));
        }
      });
      return result;
    }
  }
};
</script>

<style lang="scss" scoped>
  @import './singer_detail.scss';
</style>
