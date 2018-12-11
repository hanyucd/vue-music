import Vue from 'vue';
import Router from 'vue-router';

import Recommend from '@/page/recommend/recommend'; // 推荐页面
import RecommendSongList from '@/page/recommend_songList/recommend_songList'; // 推荐歌单详情页面

import Singer from '@/page/singer/singer'; // 歌手页面
import SingerDetail from '@/page/singer_detail/singer_detail'; // 歌手详情页面

import Rank from '@/page/rank/rank'; // 排行榜页面
import RankDetail from '@/page/rank_detail/rank_detail'; // 排行榜详情页面

import Search from '@/page/search/search'; // 搜索页面

import User from '@/page/user/user'; // 用户页面

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      name: 'recommend',
      component: Recommend,
      // 子路由
      children: [
        {
          path: ':id',
          component: RecommendSongList
        }
      ]
    },
    {
      path: '/singer',
      name: 'singer',
      component: Singer,
      // 子路由
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      name: 'rank',
      component: Rank,
      // 子路由
      children: [
        {
          path: ':id',
          component: RankDetail
        }
      ]
    },
    {
      path: '/search',
      name: 'search',
      component: Search,
      // 子路由
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/user',
      name: 'user',
      component: User
    }
  ]
});
