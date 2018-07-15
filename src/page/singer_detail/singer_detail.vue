<template>
  <transition name="slide">
    <div id="singer_detail">
      {{ singer }}
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters([
      'singer'
    ])
  },
  created() {
    console.log(this.singer);
  }
};
</script>

<style lang="scss" scoped>
  @import './singer_detail.scss';
</style>
