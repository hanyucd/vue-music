<template>
  <div id="recommend" ref="recommend">
    <scroll class="recommend-content" ref="scroll" :data="discList">
      <article>
        <!-- 轮播图 | 当请求到 recommends 时才渲染-->
        <section v-if="recommends.length" class="slider-wrapper">
          <slider>
            <!-- 插槽 -->
            <div v-for="item of recommends" :key="item.id">
              <a :src="item.linkUrl">
                <img :src="item.picUrl" @load="loadImg" class="needsclick" alt=""/>
              </a>
            </div>
          </slider>
        </section>
        <!-- 歌单推荐列表 -->
        <section class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li class="item" v-for="(item, index) in discList" :key="index" @click="selectItem(item)">
              <div class="icon">
                <img v-lazy="item.imgurl" width="60" height="60" />
              </div>
              <div class="text">
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </section>
      </article>
      <!-- loading 组件 -->
      <article class="loading-container" v-show="!discList.length">
        <loading></loading>
      </article>
    </scroll>

    <router-view></router-view>
  </div>
</template>

<script>
// 导入子组件
import Slider from './slider/slider';
import Scroll from '@/components/scroll/scroll';
import Loading from '@/components/loading/loading';
// 导入数据接口
import { getRecommend, getDiscList } from '@/api/recommend';
import { ERROR_OK } from '@/api/config';
// 导入 mixin (混入)
import { playlistMixin } from '@/assets/js/mixin';
// 导入 vuex
import { mapMutations } from 'vuex';

export default {
  mixins: [
    playlistMixin
  ],
  components: {
    Slider,
    Scroll,
    Loading
  },
  data() {
    return {
      recommends: [], // Top 轮播图
      discList: [] // 推荐歌单
    };
  },
  created() {
    this._fetchRecommend();
    setTimeout(() => {
      this._getDiscList();
    }, 2000);
  },
  methods: {
    ...mapMutations({
      setSongList: 'SET_SONG_LIST'
    }),
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
    },
    // 当首次获取到图片时，Better-scroll 重新计算
    loadImg() {
      if (!this.flag) {
        this.$refs.scroll.refresh();
        this.flag = true;
      }
    },
    /*
     * 子路由跳转
     */
    selectItem(item) {
      this.$router.push({
        path: `recommend/${ item.dissid }`
      });
      // 写入 vuex 中
      this.setSongList(item);
    },
    /*
     *当有迷你播放器时，调整滚动底部距离
     */
    handlePlaylist(playlist) {
      let bottom = playlist.length > 0 ? '60px' : '';
      this.$refs.recommend.style.bottom = bottom;
      this.$refs.scroll.refresh();
    }
  }
};
</script>

<style lang="scss" scoped>
  @import './recommend.scss';
</style>
