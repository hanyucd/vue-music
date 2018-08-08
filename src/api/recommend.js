import jsonp from '@/assets/js/jsonp';
import axios from 'axios';
import { commonParams, options } from './config';

/**
 * 接口：https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg
 *
 * jsonp 抓取推荐页轮播图数据
 */
export function getRecommend() {
  let url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';
  let data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  });

  return jsonp(url, data, options);
};

/**
 * 抓取推荐页歌单列表数据 | 让后端代理请求
 *
 * 接口：https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg
 * 接口提供方使用了 referer:https://y.qq.com/portal/playlist.html
 * axios 结合 node.js 代理后端请求
 */
export function getDiscList() {
  let url = '/api/getDiscList';

  let data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 20,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  });

  return axios.get(url, { params: data })
    .then(res => {
      // 直接返回成功状态的 Promise
      return Promise.resolve(res.data);
    })
    .catch(error => {
      console.log('请求失败:', error);
    });
};

/**
 *  抓取推荐页歌单数据 | 让后端代理请求
 *
 * 接口：https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg
 * 提供方：https://y.qq.com/n/yqq/playlist/1471714611.html
 */
export function getSongList(disstid) {
  let url = '/api/getSongList';

  let data = Object.assign({}, commonParams, {
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    g_tk: 5381,
    hostUin: 0,
    needNewCode: 0,
    format: 'json'
  });

  return axios.get(url, {params: data})
    .then(res => {
      return Promise.resolve(res.data);
    }).catch(error => {
      console.log('请求失败:', error);
    });
};
