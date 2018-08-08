<template>
  <div id="rank_list">
    <div class="top-list">
      <ul>
        <li class="item">
           <!-- 左边图片 -->
          <div class="icon">
            <img width="100" height="100" />
          </div>
          <!-- 右边歌曲 -->
          <ul class="song-list">
            <li class="song">
              <span></span>
              <span></span>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
import { getRankList } from '@/api/rank';
import { ERROR_OK } from '@/api/config';

export default {
  data() {
    return {
      rankList: []
    };
  },
  created() {
    this._fetchRankList();
  },
  methods: {
    _fetchRankList() {
      getRankList().then(res => {
        if (res.code === ERROR_OK) {
          console.log(res.data.topList);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
  @import './rank_list.scss';
</style>
