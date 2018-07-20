<template>
  <transition name="slide">
    <div id="singer_detail">
      {{ singer }}
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex';

import { getSingerDetail } from '@/api/singer';
import { ERROR_OK } from '@/api/config';

export default {
  computed: {
    ...mapGetters([
      'singer'
    ])
  },
  created() {
    console.log(this.singer);
    this._fetchSingerDetail(this.singer.id);
  },
  methods: {
    /*
     * 获取指定歌手详情
     */
    _fetchSingerDetail(singerId) {
      // 禁止直接刷新页面（获取不到歌手 id）
      if (!this.singer.id) {
        this.$router.push({ path: '/singer' });
        return;
      }

      getSingerDetail(singerId).then(res => {
        if (res.code === ERROR_OK) {
          console.log(res.data.list);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import './singer_detail.scss';
</style>
