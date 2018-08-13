<template>
  <div id="suggest">
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item, index) in result" :key="index">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { search } from '@/api/search';

import { createSong, isValidMusic, processSongsUrl } from '@/assets/js/song';

const TYPE_SINGER = 'singer';

export default {
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
      result: [] // 接受搜索结果
    };
  },
  watch: {
    query() {
      this._search();
    }
  },
  methods: {
    _search() {
      search(this.query, this.page, this.zhida, this.perpage).then(res => {
        if (res.code === 0) {
          this._formatSearchResutl(res.data).then(result => {
            this.result = this.result.concat(result);
          });
        }
      });
    },
    /*
     * 重组 res.data 数据
     */
    _formatSearchResutl(data) {
      let ret = [];

      if (data.zhida && this.page === 1) {
        ret.push({...data.zhida, ...{ type: TYPE_SINGER }});
      }

      return processSongsUrl(this._normalizeSongs(data.song.list)).then(songs => {
        ret = ret.concat(songs);
        return ret;
      });
    },
    /*
     * 格式化歌手信息
     */
    _normalizeSongs(list) {
      let ret = [];

      list.forEach(musicData => {
        if (isValidMusic(musicData)) {
          createSong(musicData).then(data => {
            ret.push(data);
          });
        }
      });
      return ret;
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
