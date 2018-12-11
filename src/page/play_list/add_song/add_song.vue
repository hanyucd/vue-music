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
        <search-box ref="searchBox" placeholder="搜索歌曲" v-on:query="onQueryChange"></search-box>
      </section>

      <!-- 切换区块 -->
      <section class="shortcut" v-show="!query">
        <switch-table :switches="switches" :currentIndex="currentIndex" v-on:switch="switchTable"></switch-table>
        <div class="list-wrapper">
          <!-- 最近播放 -->
          <scroll class="list-scroll" ref="songList" v-if="currentIndex === 0" :data="playHistory">
            <div class="list-inner">
              <song-list :songs="playHistory" v-on:select="selectSong"></song-list>
            </div>
          </scroll>
          <!-- 搜索历史 -->
          <scroll class="list-scroll" ref="searchList" v-if="currentIndex === 1" :data="searchHistory">
            <div class="list-inner">
              <search-list :searches="searchHistory" v-on:select="addQuery" v-on:delete="deleteSong"></search-list>
            </div>
          </scroll>
        </div>
      </section>

      <!-- 搜索区块 -->
      <section class="search-result" v-show="query">
        <suggest :query="query" :zhida="zhida" v-on:select="selectSuggest"></suggest>
      </section>

      <top-tip ref="topTip" :delay="2000">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">已成功添加到播放列表</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script>
import SearchBox from '@/components/search_box/search_box';
import Suggest from '@/components/suggest/suggest';
import SwitchTable from '@/components/switch_table/switch_table';
import Scroll from '@/components/scroll/scroll';
import SongList from '@/components/song_list/song_list';
import SearchList from '@/components/search_list/search_list';
import TopTip from './top_tip/top_tip';

import Song from '@/assets/js/song';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    SearchBox,
    Suggest,
    SwitchTable,
    Scroll,
    SongList,
    SearchList,
    TopTip
  },
  data() {
    return {
      showFlag: false,
      query: '',
      zhida: false, // 不搜索歌手
      switches: [
        { name: '最近播放' },
        { name: '搜索历史' }
      ],
      currentIndex: 0 // 当前切换开关
    };
  },
  computed: {
    ...mapGetters([
      'playHistory',
      'searchHistory'
    ])
  },
  methods: {
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory',
      'insertSong'
    ]),
    show() {
      this.showFlag = true;
      setTimeout(() => {
        this.currentIndex === 0 ? this.$refs.songList.refresh() : this.$refs.searchList.refresh();
      }, 20);
    },
    hide() {
      this.showFlag = false;
    },
    onQueryChange(query) {
      this.query = query;
    },
    /*
     * 切换 Table
     */
    switchTable(index) {
      this.currentIndex = index;
    },
    selectSong(song, index) {
      if (index !== 0) {
        // 调用 actions
        this.insertSong(new Song(song));
      }
      this.showTopTip();
    },
    addQuery(item) {
      this.$refs.searchBox.setQuery(item);
    },
    deleteSong(item) {
      // 调用 actions
      this.deleteSearchHistory(item);
    },
    /*
     * 缓存搜索历史 | 调 Actions
     */
    selectSuggest() {
      this.saveSearchHistory(this.query);
      this.showTopTip();
    },
    /*
     * 显示顶部提示窗
     */
    showTopTip() {
      this.$refs.topTip.show();
    }
  }
};
</script>

<style lang="scss" scoped>
  @import './add_song.scss';
</style>
