import { commonParams } from './config';
import axios from 'axios';

/**
 * axios 抓取歌词数据 | 让后端代理请求
 * 接口：https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg
 * 原始地址：https://y.qq.com/portal/player.html
 * axios 结合 node.js 代理后端请求
 */
export function getLyric(mid) {
  let url = '/api/lyric';

  let data = Object.assign({}, commonParams, {
    songmid: mid,
    pcachetime: +new Date(),
    platform: 'yqq',
    g_tk: 5381,
    hostUin: 0,
    needNewCode: 0,
    format: 'json'
  });

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data);
  }).catch(error => {
    console.log('请求失败:', error);
  });
};
