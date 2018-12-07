<template>
  <div id="search_box">
    <i class="icon-search"></i>
    <input class="box" ref="queryRef" type="text" v-model="query" :placeholder="placeholder" />
    <i class="icon-dismiss" v-show="query" @click="clear"></i>
  </div>
</template>

<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  data() {
    return {
      query: ''
    };
  },
  created() {
    this.$watch('query', (newQuery) => {
      this.$emit('query', newQuery);
    });
  },
  methods: {
    /*
     * 清空输入框
     */
    clear() {
      this.query = '';
    },
    /*
     * 提供父组件用的，传入到搜索框的值
     */
    setQuery(query) {
      this.query = query;
    },
    /*
     * 提供父组件用的
     */
    blur() {
      // 让输入框失去焦点，避免滚动搜索结果时移动端键盘遮挡
      this.$refs.queryRef.blur();
    }
  }
};
</script>

<style lang="scss" scoped>
  @import './search_box.scss';
</style>
