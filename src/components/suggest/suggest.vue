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
        console.log(res);
        if (res.code === 0) {
          // this.result = this._formatSearchResutl(res.data);
          console.log(res.data);
        }
      });
    },
    /*
     * 重组 res.data 数据
     */
    _formatSearchResutl(data) {
      let ret = [];

      if (data.zhida && data.zhida.singerid) {
        ret.push({...data.zhida, ...{ type: TYPE_SINGER }});
      }

      if (data.song) {
        ret = ret.concat(data.song.list);
      }

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
