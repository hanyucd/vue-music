import Vue from 'vue';
import Router from 'vue-router';

import Recommend from '@/page/recommend/recommend'; // 推荐页面
import Singer from '@/page/singer/singer'; // 歌手页面
import RankList from '@/page/rank_list/rank_list'; // 排行榜页面
import Search from '@/page/search/search'; // 搜索页面

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/recommend',
      name: 'recommend',
      component: Recommend
    },
    {
      path: '/singer',
      name: 'singer',
      component: Singer
    },
    {
      path: '/rank_list',
      name: 'rankList',
      component: RankList
    },
    {
      path: '/search',
      name: 'search',
      component: Search
    }
  ]
});
