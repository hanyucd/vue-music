<template>
  <header id="header">
    <div class="icon"></div>
    <h1 class="title">VUE MUSIC</h1>
    <router-link class="mine" to="/user" tag="div">
      <i class="icon-mine"></i>
    </router-link>
  </header>
</template>

<script>
export default {
  data() {
    return {
    };
  }
};
</script>

<style lang="scss" scoped>
  @import './header.scss';
</style>
