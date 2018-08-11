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
