<template>
  <scroll id="list_view" :data="singerData">
    <ul>
      <li class="list-group" v-for="(group, index) in singerData" :key="index">
        <h2 class="list-group-title">{{ group.title }}</h2>
        <ul>
          <li class="list-group-item" v-for="(item, index) of group.items" :key="index">
            <img class="avatar" v-lazy="item.avatar" @click="click"/>
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
     <!-- 右侧字母列表 -->
    <article class="letter-container">
      <ul>
        <li v-for="(item, index) of letterList" :key="index" class="item">
          {{ item }}
        </li>
      </ul>
    </article>
  </scroll>
</template>

<script>
import Scroll from '@/components/scroll/scroll';

export default {
  components: {
    Scroll
  },
  props: {
    singerData: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {};
  },
  computed: {
    // 字母排列数组
    letterList() {
      return this.singerData.map(item => {
        return item.title.substr(0, 1); // 从起始索引号提取字符串中指定数目的字符
      });
    }
  }
};
</script>

<style lang="scss" scoped>
  @import './listview.scss';
</style>
