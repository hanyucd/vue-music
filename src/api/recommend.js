import jsonp from '@/assets/js/jsonp';
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
