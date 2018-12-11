<template>
  <transition name="user">
    <div id="user_center">
      <section class="back" @click="back">
        <i class="icon-back"></i>
      </section>

      <section class="switch-wrapper">
        <switch-table :switches="switches" :currentIndex="currentIndex" v-on:switch="switchItem"></switch-table>
      </section>

      <section ref="playBtn" class="play-btn">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </section>

      <section class="list-wrapper" ref="listWrapper">
      </section>
    </div>
  </transition>
</template>

<script>
import SwitchTable from '@/components/switch_table/switch_table';

export default {
  components: {
    SwitchTable
  },
  data() {
    return {
      switches: [
        { name: '我的收藏' },
        { name: '最近播放' }
      ],
      currentIndex: 0
    };
  },
  methods: {
    back() {
      this.$router.back();
    },
    switchItem(index) {
      this.currentIndex = index;
    }
  }
};
</script>

<style lang="scss" scoped>
  @import './user.scss';
</style>
