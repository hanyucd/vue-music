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
      </section>

      <!-- 搜索区块 -->
      <section class="search-result" v-show="query">
        <suggest :query="query" :zhida="zhida" v-on:select="selectSuggest"></suggest>
      </section>
    </div>
  </transition>
</template>

<script>
import SearchBox from '@/components/search_box/search_box';
import Suggest from '@/components/suggest/suggest';
import SwitchTable from '@/components/switch_table/switch_table';

import { mapActions } from 'vuex';

export default {
  components: {
    SearchBox,
    Suggest,
    SwitchTable
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
  methods: {
    ...mapActions([
      'saveSearchHistory'
    ]),
    show() {
      this.showFlag = true;
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
    /*
     * 缓存搜索历史 | 调 Actions
     */
    selectSuggest() {
      this.saveSearchHistory(this.query);
    }
  }
};
</script>

<style lang="scss" scoped>
  @import './add_song.scss';
</style>
