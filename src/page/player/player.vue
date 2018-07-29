<template>
  <div id="player" v-show="playlist.length > 0">
    <section class="normal-player" v-show="fullScreen">
      播放器
    </section>

    <section class="mini-player" v-show="!fullScreen">
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters([
      'fullScreen',
      'playlist'
    ])
  }
};
</script>

<style lang="scss" scoped>
  @import './player.scss';
</style>
