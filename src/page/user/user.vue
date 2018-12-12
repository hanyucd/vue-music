<template>
  <transition name="user">
    <div id="user_center">
      <section class="back" @click="back">
        <i class="icon-back"></i>
      </section>

      <section class="switch-wrapper">
        <switch-table :switches="switches" :currentIndex="currentIndex" v-on:switch="switchItem"></switch-table>
      </section>

      <section ref="playBtn" class="play-btn" @click="random()">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </section>

      <section class="list-wrapper" ref="listWrapper">
        <!-- 我的收藏 -->
        <scroll class="list-scroll" ref="favoriteList" v-if="currentIndex === 0" :data="favoriteList">
          <div class="list-inner">
            <song-list :songs="favoriteList" v-on:select="selectSong"></song-list>
          </div>
        </scroll>
        <!-- 最近播放 -->
        <scroll class="list-scroll" ref="playHistory" v-if="currentIndex === 1" :data="playHistory">
          <div class="list-inner">
            <song-list :songs="playHistory" v-on:select="selectSong"></song-list>
          </div>
        </scroll>
      </section>

      <article class="no-result-wrapper" v-show="noResult">
        <span v-show="currentIndex === 0">
          暂无 收藏 歌曲 ~
        </span>
        <span v-show="currentIndex === 1">
          暂无 播放 歌曲 ~
        </span>
      </article>
    </div>
  </transition>
</template>

<script>
import SwitchTable from '@/components/switch_table/switch_table';
import Scroll from '@/components/scroll/scroll';
import SongList from '@/components/song_list/song_list';

import Song from '@/assets/js/song';
import { playlistMixin } from '@/assets/js/mixin';
import { mapGetters, mapActions } from 'vuex';

export default {
  mixins: [
    playlistMixin
  ],
  components: {
    SwitchTable,
    Scroll,
    SongList
  },
  data() {
    return {
      switches: [
        { name: '我的收藏' },
        { name: '最近播放' }
      ],
      currentIndex: 0
    };
  },
  computed: {
    ...mapGetters([
      'playHistory',
      'favoriteList'
    ]),
    noResult() {
      if (this.currentIndex === 0) {
        return !this.favoriteList.length;
      }
      if (this.currentIndex === 1) {
        return !this.playHistory.length;
      }
    }
  },
  methods: {
    ...mapActions([
      'insertSong',
      'randomPlay'
    ]),
    back() {
      this.$router.back();
    },
    /*
     * 切换 table
     */
    switchItem(index) {
      this.currentIndex = index;
    },
    /*
     * 点击歌曲处理
     */
    selectSong(song) {
      this.insertSong(new Song(song));
    },
    /*
     * 点击随机播放
     */
    random() {
      let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory;
      if (list.length === 0) return;

      list = list.map(item => {
        return new Song(item);
      });
      this.randomPlay({ list });
    },
    /*
     * 当有迷你播放器时，调整滚动底部距离
     */
    handlePlaylist(playlist) {
      let bottom = playlist.length > 0 ? '60px' : 0;
      this.$refs.listWrapper.style.bottom = bottom;
      this.$refs.favoriteList && this.$refs.favoriteList.refresh();
      this.$refs.playHistory && this.$refs.playHistory.refresh();
    }
  }
};
</script>

<style lang="scss" scoped>
  @import './user.scss';
</style>
