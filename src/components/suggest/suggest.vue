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
    query(newQuery) {
      if (!newQuery) return;
      this._search();
    }
  },
  methods: {
    _search() {
      search(this.query, this.page, this.zhida, this.perpage).then(res => {
        if (res.code === 0) {
          this._formatSearchResult(res.data).then(result => {
            this.result = result;
          });
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
