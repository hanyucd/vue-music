<template>
  <div id="recommend">
    <div class="recommend-content">
      <!-- 轮播图 | 当请求到 recommends 时才渲染-->
      <section v-if="recommends.length" class="slider-wrapper">
        <slider>
          <!-- 插槽 -->
          <div v-for="item of recommends" :key="item.id">
            <a :src="item.linkUrl">
              <img :src="item.picUrl" />
            </a>
          </div>
        </slider>
      </section>
      <!-- 歌单列表 -->
      <section class="recommend-list">
        <h1 class="list-title">热门歌单推荐</h1>
        <ul>
        </ul>
      </section>
    </div>
  </div>
</template>

<script>
import Slider from './slider/slider';

import { getRecommend, getDiscList } from '@/api/recommend';
import { ERROR_OK } from '@/api/config';

export default {
  data() {
    return {
      recommends: []
    };
  },
  created() {
    this._fetchRecommend();
    this._getDiscList();
  },
  methods: {
    // 获取顶部轮播图数据
    _fetchRecommend() {
      getRecommend().then(res => {
        if (res.code === ERROR_OK) {
          this.recommends = res.data.slider;
        }
      });
    },
    _getDiscList() {
      getDiscList().then(res => {
        console.log(res);
        if (res.code === ERROR_OK) {
        }
      });
    }
  },
  components: {
    Slider
  }
};
</script>

<style lang="scss" scoped>
  @import './recommend.scss';
</style>
