<template>
  <div id="search">
    <!-- 搜索框 -->
    <article class="search-box-wrapper">
      <search-box ref="searchBox" v-on:query="onQueryChange"></search-box>
    </article>

    <div class="shortcut-wrapper" ref="shortcutWrapper" v-show="!query">
      <scroll class="shortcut" ref="scroll" :data="shortcut">
        <div>
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
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list :searches="searchHistory" v-on:select="addQuery" v-on:delete="deleteHistory"></search-list>
          </section>
        </div>
      </scroll>
    </div>

    <article class="search-result" ref="searchResult" v-show="query">
      <suggest ref="suggest" :query="query" v-on:beforeScroll="blurInput" v-on:select="saveSearch"></suggest>
    </article>

    <confirm ref="confirm" text="确定清空历史记录" v-on:confirm="confirm" v-on:cancel="cancel"></confirm>
  </div>
</template>

<script>
import SearchBox from '@/components/search_box/search_box';
import Suggest from '@/components/suggest/suggest';
import SearchList from '@/components/search_list/search_list';
import Confirm from '@/components/confirm/confirm';
import Scroll from '@/components/scroll/scroll';

import { getHotKey } from '@/api/search';
import { mapActions, mapGetters } from 'vuex';
import { playlistMixin } from '@/assets/js/mixin';

export default {
  mixins: [playlistMixin],
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Confirm,
    Scroll
  },
  data() {
    return {
      hotKey: [], // / 热门搜索关键词
      query: '' // 搜索关键字
    };
  },
  computed: {
    ...mapGetters([ 'searchHistory' ]),
    shortcut() {
      return this.hotKey.concat(this.searchHistory);
    }
  },
  watch: {
    query(newVal) {
      if (!newVal) {
        // 解决添加歌曲后不能滚动的问题
        setTimeout(() => {
          this.$refs.scroll.refresh();
        }, 20);
      }
    }
  },
  created() {
    this._getHotKey();
  },
  methods: {
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory',
      'clearSearchHistory'
    ]),
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
    },
    /*
     * 删除单条搜索历史
     */
    deleteHistory(item) {
      this.deleteSearchHistory(item);
    },
    /*
     * 显示弹框
     */
    showConfirm() {
      this.$refs.confirm.show();
    },
    /*
    * 清空搜索历史
    */
    confirm() {
      this.clearSearchHistory();
    },
    /*
    * 取消清空搜索历史
    */
    cancel() {
    },
    /*
     * 当有迷你播放器时，调整滚动底部距离
     */
    handlePlaylist(playlist) {
      let bottom = playlist.length > 0 ? '60px' : 0;

      this.$refs.shortcutWrapper.style.bottom = bottom;
      this.$refs.scroll.refresh();

      this.$refs.searchResult.style.bottom = bottom;
      this.$refs.suggest.refresh();
    }
  }
};
</script>

<style lang="scss" scoped>
  @import './search.scss';
</style>
