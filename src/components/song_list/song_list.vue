<template>
  <div id="song_list">
    <ul>
      <li class="item" v-for="(item, index) of songs" :key="item.id" @click="selectItem(item, index)">
        <!-- 排行奖杯图片 -->
        <section class="rank" v-show="rank">
          <span :class="getRankCls(index)">{{ getRankText(index) }}</span>
        </section>

        <section class="content">
          <h2 class="name">{{ item.name }}</h2>
          <p class="desc">{{ item | defDesc }}</p>
        </section>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    songs: {
      type: Array,
      defaule: () => []
    },
    // 排行奖杯图片
    rank: {
      type: Boolean,
      default: false
    }
  },
  // 过滤器
  filters: {
    defDesc(data) {
      // 重组数据
      return `${ data.singer } - ${ data.album }`;
    }
  },
  methods: {
    selectItem(item, index) {
      this.$emit('select', item, index);
    },
    /*
     * 排行奖杯图片
     */
    getRankCls(index) {
      if (index <= 2) {
        return `icon icon_${ index }`;
      } else {
        return 'text';
      }
    },
    /*
     * 排行奖杯文案
     */
    getRankText(index) {
      if (index > 2) return index + 1;
    }
  }
};
</script>

<style lang="scss" scoped>
  @import './song_list.scss';
</style>
