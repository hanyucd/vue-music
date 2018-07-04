<template>
  <div id="recommend">
    <scroll class="recommend-content" :data="discList">
      <article>
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
        <!-- 歌单推荐列表 -->
        <section class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li class="item" v-for="(item, index) in discList" :key="index">
              <div class="icon">
                <img :src="item.imgurl" width="60" height="60" />
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </section>
      </article>
    </scroll>
  </div>
</template>

<script>
import Slider from './slider/slider';
import Scroll from '@/components/scroll/scroll';

import { getRecommend, getDiscList } from '@/api/recommend';
import { ERROR_OK } from '@/api/config';

export default {
  components: {
    Slider,
    Scroll
  },
  data() {
    return {
      recommends: [], // Top 轮播图
      discList: [] // 推荐歌单
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
    // 获取歌单列表数据
    _getDiscList() {
      getDiscList().then(res => {
        if (res.code === ERROR_OK) {
          this.discList = res.data.list;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
  @import './recommend.scss';
</style>
