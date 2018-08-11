<template>
  <div id="search">
    <!-- 搜索框 -->
    <article class="search-box-wrapper">
      <search-box ref="searchBox"></search-box>
    </article>

    <div class="shortcut-wrapper">
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
      </div>
    </div>
  </div>
</template>

<script>
import SearchBox from '@/components/search_box/search_box';

import { getHotKey } from '@/api/search';

export default {
  components: {
    SearchBox
  },
  data() {
    return {
      hotKey: [] // / 热门搜索关键词
    };
  },
  created() {
    this._getHotKey();
  },
  methods: {
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
    }
  }
};
</script>

<style lang="scss" scoped>
  @import './search.scss';
</style>
