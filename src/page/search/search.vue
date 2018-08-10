<template>
  <div id="search">
    <!-- 搜索框 -->
    <article class="search-box-wrapper">
      <search-box></search-box>
    </article>
  </div>
</template>

<script>
import SearchBox from '@/components/search_box/search_box';

export default {
  components: {
    SearchBox
  },
  data() {
    return {
      msg: '搜索'
    };
  }
};
</script>

<style lang="scss" scoped>
  @import './search.scss';
</style>
