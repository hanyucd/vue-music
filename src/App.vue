<template>
  <div id="app">
    <Header></Header>
    <nav-table></nav-table>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import Header from '@/components/header/header';
import NavTable from '@/components/nav_table/nav_table';
import Player from '@/page/player/player';

export default {
  name: 'App',
  components: {
    Header,
    NavTable,
    Player
  }
};
</script>

<style lang="scss">
  @import '@/assets/scss/index.scss';
</style>
