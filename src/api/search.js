import jsonp from '@/assets/js/jsonp';
import { commonParams, options } from './config';

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

/**
 * jsonp 抓取搜索检索数据
 *
 * 接口：https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp
 */
export function search(query, page, zhida, perpage) {
  let url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp';

  let data = Object.assign({}, commonParams, {
    w: query,
    p: page,
    catZhida: zhida ? 1 : 0,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage,
    n: perpage,
    remoteplace: 'txt.mqq.all',
    uid: 0,
    needNewCode: 1,
    platform: 'h5'
  });

  return jsonp(url, data, options);
};
