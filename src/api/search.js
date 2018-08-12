import jsonp from '@/assets/js/jsonp';
import { commonParams, options } from './config';
import axios from 'axios';

/**
 * jsonp 抓取热门搜索数据
 *
 * 接口：https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg
 */
export function getHotKey() {
  let url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg';
  let data = Object.assign({}, commonParams, {
    uin: 0,
    format: 'json',
    platform: 'h5',
    needNewCode: 1
  });

  return jsonp(url, data, options);
};

const debug = process.env.NODE_ENV !== 'production';

/**
 * jsonp 抓取搜索检索数据
 *
 * 接口：https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp
 */
export function search(query, page, zhida, perpage) {
  let url = debug ? '/api/search' : 'http://ustbhuangyi.com/music/api/search';

  let data = Object.assign({}, commonParams, {
    w: query,
    p: page,
    perpage,
    n: perpage,
    catZhida: zhida ? 1 : 0,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    remoteplace: 'txt.mqq.all',
    uin: 0,
    needNewCode: 1,
    platform: 'h5',
    format: 'json'
  });

  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data);
  });
};
