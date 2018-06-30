<template>
  <div id="nav_table">
    <router-link tag="div" class="nav-tab" :to={ name: "Recommend" }>
      <span>{{ nav.recommend }}</span>
    </rotuer-link>

    <router-link tag="div" class="nav-tab" :to={ name: "Singer" }>
      <span>{{ nav.singer }}</span>
    </rotuer-link>

    <router-link tag="div" class="nav-tab" :to={ name: "RankList" }>
      <span>{{ nav.rankList }}</span>
    </rotuer-link>

    <router-link tag="div" class="nav-tab" :to={ name: "Search" }>
      <span>{{ nav.search }}</span>
    </rotuer-link>
  </div>
</template>

<script>
export default {
  data () {
    return {
      nav: {
        recommend: '推荐',
        singer: '歌手',
        rankList: '排行',
        search: '搜索'
      }
    };
  }
};
</script>

<style lang="scss" scoped>
  @import './nav_table.scss';
</style>
