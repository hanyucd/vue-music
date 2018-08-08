<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bgImage="bgImage"></music-list>
  </transition>
</template>

<script>
import { getSingerDetail } from '@/api/singer';
import { ERROR_OK } from '@/api/config';
import { createSong } from '@/assets/js/song';

import { mapGetters } from 'vuex';

import MusicList from '@/components/music_list/music_list';

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
      'singer'
    ]),
    // 标题 | 传给子组件
    title() {
      return this.singer.name;
    },
    // 背景图 | 传给子组件
    bgImage() {
      return this.singer.avatar;
    }
  },
  created() {
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
     * 重组歌手数据 | 过滤出所需数据
     */
    _normalizeSongs(list) {
      let result = [];
      list.forEach(item => {
        // 对象结构赋值
        let { musicData } = item;

        if (musicData.songid && musicData.albummid) {
          // 立即执行箭头函数
          (async () => {
            let data = await createSong(musicData);
            result.push(data);
          })();
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
