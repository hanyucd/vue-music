<template>
  <div id="nav_table">
    <!-- 顶部导航页面 -->
    <router-link tag="div" v-for="(item, key, index) in nav" :key="index" class="nav-tab" :to="{ name: key }">
      <span class="nav-title" @click="moveBottomLine(index)">{{ item }}</span>
    </router-link>
    <!-- 下划线 -->
    <article class="bottom-line" ref="bottomLine"></article>
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
  },
  methods: {
    /*
      位移下划线
    */
    moveBottomLine(index) {
      let navCount = Object.keys(this.nav).length;
      let divide = 100 / navCount; // 一等分长度
      let moveLen = index * divide; // 位移长度
      this.$refs.bottomLine.style.left = `${ moveLen }%`;
    }
  }
};
</script>

<style lang="scss" scoped>
  @import './nav_table.scss';
</style>
