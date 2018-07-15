<template>
  <div id="singer">
    <list-view :singerData="singerList" v-on:select="selectSinger"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
import { getSingerList } from '@/api/singer';
import { ERROR_OK } from '@/api/config';
import { createSinger } from '@/assets/js/singer';
// 子组件
import ListView from './listview/listview';

import { mapMutations } from 'vuex';

const HOT_NAME = '热门';
const HOT_SINGER_LEN = 10;

export default {
  components: {
    ListView
  },
  data() {
    return {
      singerList: []
    };
  },
  created() {
    this._fetchSingerData();
  },
  methods: {
    /*
     * 获取歌手列表数据
     */
    _fetchSingerData() {
      getSingerList().then(res => {
        if (res.code === ERROR_OK) {
          this.singerList = this._normalizeSinger(res.data.list);
        }
        console.log(this.singerList[0].items);
      });
    },
    /*
     * 重组 res.data.list 数据 | 按字母 A - Z 排列
     */
    _normalizeSinger(list) {
      let obj = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      };
      // 遍历数组中每一个元素 & 执行回调函数
      list.forEach((item, index) => {
        // 取前 10 条数据到 热门
        if (index < HOT_SINGER_LEN) {
          obj.hot.items.push(createSinger(item));
        }

        // 取出字母（a - z）
        const key = item.Findex;
        if (!obj[key]) {
          // 若 obj 中不存在该字母，则先向 obj 中添加该元素（key: value）
          obj[key] = {
            title: key,
            items: []
          };
        }
        obj[key].items.push(createSinger(item));
      });
      // 处理为 有序列表
      let hot = [];
      let other = [];
      for (let key in obj) {
        let value = obj[key];
        // 若匹配到字母则添加进 other
        if (value.title.match(/[a-zA-Z]/)) {
          other.push(value);
        } else if (value.title === HOT_NAME) {
          hot.push(value);
        }
      }
      // 对字母 排序
      other.sort((a, b) => {
        // charCodeAt | 返回在指定的位置的字符的 Unicode 编码
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });

      return [...hot, ...other];
    },
    /*
     * 监听子组件派发的事件 | 接收值
     */
    selectSinger(singer) {
      this.$router.push({
        path: `singer/${ singer.id }`
      });
      this.setSinger(singer);
    },
    /*
     *  vuex | mutations
     */
    ...mapMutations({
      setSinger: 'set_singer'
    })
  }
};
</script>

<style lang="scss" scoped>
  @import './singer.scss';
</style>
