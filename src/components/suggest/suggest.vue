<template>
  <scroll
    id="suggest"
    ref="suggest"
    :data="result"
    :pullup="pullup"
    v-on:scrollToEnd="_searchMore"
  >
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item, index) in result" :key="index">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title="加载中..."></loading>
    </ul>
  </scroll>
</template>

<script>
import Scroll from '../scroll/scroll';
import Loading from '../loading/loading';
import { search } from '@/api/search';
import { createSong, isValidMusic, processSongsUrl } from '@/assets/js/song';

const TYPE_SINGER = 'singer';

export default {
  components: {
    Scroll,
    Loading
  },
  props: {
    // 接受的检索值
    query: {
      type: String,
      default: ''
    },
    // 是否显示歌手
    zhida: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      page: 1, // 当前检索页数，用于下拉加载
      perpage: 20, // 每一页的数量
      result: [], // 存放搜索结果
      pullup: true, // 滚动到底部，下拉加载
      hasMore: true // 标识符 | 是否加载完
    };
  },
  watch: {
    query(newQuery) {
      if (!newQuery) {
        this.result = [];
        return;
      }
      this._search();
    }
  },
  methods: {
    /*
     * 发送搜索关键字请求
     */
    _search() {
      this.page = 1;
      this.result = []; // 初始化为空数组
      this.hasMore = true;
      // 滚动到指定的位置 | 顶部
      this.$refs.suggest.scrollTo(0, 0);

      search(this.query, this.page, this.zhida, this.perpage).then(res => {
        if (res.code === 0) {
          this._formatSearchResult(res.data).then(result => {
            this.result = result;
          });
          this._checkMore(res.data);
        }
      });
    },
    /*
     * 加载更多搜索内容
     */
    _searchMore() {
      if (!this.hasMore) return;

      this.page++;
      search(this.query, this.page, this.zhida, this.perpage).then(res => {
        if (res.code === 0) {
          this._formatSearchResult(res.data).then(result => {
            this.result = [...this.result, ...result];
          });
          this._checkMore(res.data);
        }
      });
    },
    /*
     * 重组 res.data 数据
     */
    async _formatSearchResult(data) {
      let ret = [];

      if (data.zhida && data.zhida.singerid && this.page === 1) {
        ret.push({...data.zhida, ...{ type: TYPE_SINGER }});
      }

      // 获取格式化后的歌曲信息
      let formatSongs = await this._normalizeSongs(data.song.list);

      return processSongsUrl(formatSongs).then(songs => {
        ret = ret.concat(songs);
        return ret;
      });
    },
    /*
     * 格式化歌曲信息
     */
    async _normalizeSongs(list) {
      let ret = [];

      for (let musicData of list) {
        if (isValidMusic(musicData)) {
          let data = await createSong(musicData);
          ret.push(data);
        }
      }
      console.log('结果长度：', ret.length);
      console.log('结果:', ret);
      return ret;
    },
    /*
     * 检查是否还有更多数据
     */
    _checkMore(data) {
      let song = data.song;
      // 没有数据 或 最后一页
      if (!song.list.length || (song.curnum + song.curpage * this.perpage) >= song.totalnum) {
        this.hasMore = false;
      }
    },
    /*
     * 获取 icon class 图标样式
     */
    getIconCls(item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine';
      } else {
        return 'icon-music';
      }
    },
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername;
      } else {
        return `${ item.name } - ${ item.singer }`;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
 @import './suggest.scss';
</style>
