import jsonp from '@/assets/js/jsonp';
import { commonParams, options } from './config';

/**
 * jsonp 抓取排行页数据
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
}
