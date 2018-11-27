import { commonParams, ERROR_OK } from './config';
import { getUid } from '@/assets/js/uid';
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

const debug = process.env.NODE_ENV !== 'production';

export function getSongsUrl(songs) {
  console.log('api/songs', '执行了');
  const url = debug ? '/api/getPurlUrl' : 'http://ustbhuangyi.com/music/api/getPurlUrl';

  let mids = [];
  let types = [];

  songs.forEach((song) => {
    mids.push(song.mid);
    types.push(0);
  });

  const urlMid = genUrlMid(mids, types);

  const data = Object.assign({}, commonParams, {
    g_tk: 5381,
    format: 'json',
    platform: 'h5',
    needNewCode: 1,
    uin: 0
  });

  return new Promise((resolve, reject) => {
    let tryTime = 3;

    function request() {
      return axios.post(url, {
        comm: data,
        url_mid: urlMid
      }).then((response) => {
        const res = response.data;
        if (res.code === ERROR_OK) {
          let urlMid = res.url_mid;
          if (urlMid && urlMid.code === ERROR_OK) {
            const info = urlMid.data.midurlinfo[0];
            if (info && info.purl) {
              resolve(res);
            } else {
              retry();
            }
          } else {
            retry();
          }
        } else {
          retry();
        }
      });
    }

    function retry() {
      if (--tryTime >= 0) {
        request();
      } else {
        reject(new Error('Can not get the songs url'));
      }
    }

    request();
  });
};

function genUrlMid(mids, types) {
  const guid = getUid();
  return {
    module: 'vkey.GetVkeyServer',
    method: 'CgiGetVkey',
    param: {
      guid,
      songmid: mids,
      songtype: types,
      uin: '0',
      loginflag: 0,
      platform: '23'
    }
  };
}
