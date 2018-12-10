<template>
  <div id="search">
    <!-- 搜索框 -->
    <article class="search-box-wrapper">
      <search-box ref="searchBox" v-on:query="onQueryChange"></search-box>
    </article>

    <div class="shortcut-wrapper" v-show="!query">
      <div class="shortcut">
        <!-- 热门搜索 -->
        <section class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li class="item" v-for="item of hotKey" :key="item.n" @click="addQuery(item.k)">
              <span>{{ item.k }}</span>
            </li>
          </ul>
        </section>
        <!-- 搜索历史 -->
        <section class="search-history" v-show="searchHistory.length">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear">
              <i class="icon-clear"></i>
            </span>
          </h1>
          <search-list></search-list>
        </section>
      </div>
    </div>

    <article class="search-result" v-show="query">
      <suggest :query="query" v-on:beforeScroll="blurInput" v-on:select="saveSearch"></suggest>
    </article>
  </div>
</template>

<script>
import SearchBox from '@/components/search_box/search_box';
import Suggest from '@/components/suggest/suggest';
import SearchList from '@/components/search_list/search_list';

import { getHotKey } from '@/api/search';

import { mapActions, mapGetters } from 'vuex';

export default {
  components: {
    SearchBox,
    Suggest,
    SearchList
  },
  data() {
    return {
      hotKey: [], // / 热门搜索关键词
      query: '' // 搜索关键字
    };
  },
  computed: {
    ...mapGetters([ 'searchHistory' ])
  },
  created() {
    this._getHotKey();
  },
  methods: {
    ...mapActions([ 'saveSearchHistory' ]),
    /*
     * 获取热搜索数据
     */
    _getHotKey() {
      getHotKey().then(res => {
        if (res.code === 0) {
          this.hotKey = res.data.hotkey.slice(0, 10);
        }
      });
    },
    /*
     * 调用子组件方法传递数据
     */
    addQuery(query) {
      this.$refs.searchBox.setQuery(query);
    },
    /*
     * 监听子组件派发的事件 | 当检索关键字值改变时
     */
    onQueryChange(query) {
      this.query = query;
    },
    // 滚动前触发事件
    blurInput() {
      this.$refs.searchBox.blur();
    },
    /*
     * 触发保存搜索历史 Actions
     */
    saveSearch() {
      this.saveSearchHistory(this.query);
    }
  }
};
</script>

<style lang="scss" scoped>
  @import './search.scss';
</style>
