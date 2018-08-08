import jsonp from '@/assets/js/jsonp';
import { commonParams, options } from './config';

/**
 * jsonp 抓取排行榜页面数据
 *
 * 接口（移动端）：https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg
 */
export function getRankList() {
  let url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg';

  let data = Object.assign({}, commonParams, {
    uin: 0,
    format: 'h5',
    needNewCode: 1
  });

  return jsonp(url, data, options);
};

/**
 * jsonp 抓取排行榜详情页数据
 *
 * 接口：https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg
 */
export function getRankDetail(topid) {
  let url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg';

  let data = Object.assign({}, commonParams, {
    g_tk: 5381,
    needNewCode: 1,
    platform: 'h5',
    page: 'detail',
    type: 'top',
    tpl: 3,
    topid
  });

  return jsonp(url, data, options);
};
