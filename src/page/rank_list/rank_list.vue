<template>
  <div id="rank_list" ref="rank">
    <scroll class="top-list" :data="rankList" ref="rank_list">
      <ul>
        <li class="item" v-for="item of rankList" :key="item.id">
           <!-- 左边图片 -->
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl"/>
          </div>
          <!-- 右边歌曲 -->
          <ul class="song-list">
            <li class="song" v-for="(song, index) of item.songList" :key="index">
              <span>{{ index + 1 }}.</span>
              <span>{{ song.songname }}</span>
              <span> - {{ song.singername }}</span>
            </li>
          </ul>
        </li>
      </ul>

      <!-- loading 组件 -->
      <article class="loading-container" v-show="!rankList.length">
        <Loading></Loading>
      </article>
    </scroll>

    <router-view></router-view>
  </div>
</template>

<script>
import { getRankList } from '@/api/rank';
import { ERROR_OK } from '@/api/config';

import Scroll from '@/components/scroll/scroll';
import Loading from '@/components/loading/loading';

import { playlistMixin } from '@/assets/js/mixin';

export default {
  mixins: [
    playlistMixin
  ],
  components: {
    Scroll,
    Loading
  },
  data() {
    return {
      rankList: []
    };
  },
  created() {
    this._fetchRankList();
  },
  methods: {
    _fetchRankList() {
      getRankList().then(res => {
        if (res.code === ERROR_OK) {
          this.rankList = res.data.topList;
        }
      });
    },
    /*
     * 当有迷你播放器时，调整滚动底部距离
     */
    handlePlaylist(playlist) {
      let bottom = playlist.length > 0 ? '60px' : '';
      this.$refs.rank.style.bottom = bottom;
      this.$refs.rank_list.refresh();
    }
  }
};
</script>

<style lang="scss" scoped>
  @import './rank_list.scss';
</style>
