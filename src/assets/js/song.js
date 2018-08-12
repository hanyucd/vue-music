import jsonp from '@/assets/js/jsonp';
import { commonParams, ERROR_OK } from '@/api/config';
import { getLyric, getSongsUrl } from '@/api/song';
import { Base64 } from 'js-base64';

// 创建一个歌曲类
export default class Song {
  constructor({ id, mid, singer, name, album, duration, image, url }) {
    this.id = id;
    this.mid = mid;
    this.singer = singer;
    this.name = name;
    this.album = album; // 专辑
    this.image = image; // 专辑封面图片
    this.duration = duration; // 歌曲时长 | 秒（s）
    this.url = url; // 歌曲播放源
  }
  // 获取歌词数据
  fetchLyric() {
    let _this = this;

    if (this.lyric) return Promise.resolve(this.lyric);

    return new Promise(function(resolve, reject) {
      getLyric(_this.mid).then(res => {
        if (res.retcode === ERROR_OK) {
          // 解码
          _this.lyric = Base64.decode(res.lyric);
          resolve(_this.lyric);
        } else {
          reject(new Error('no lyric'));
        }
      });
    });
  }
}

/*
 * 工厂方法 | 单例模式
 *
 * url: `http://ws.stream.qqmusic.qq.com/${ musicData.songid }.m4a?fromtag=46`
 * 注：QQ音乐 歌曲播放源地址随时都可能更改 | 对这块限制更加严格了
 */
export function createSong(musicData) {
  // getUTCMilliseconds() 方法可根据世界时 (UTC) 返回时间的毫秒(0~999)
  let ms = (new Date()).getUTCMilliseconds();
  // Math.round() 把数四舍五入为最接近的整数
  let _guid = Math.round(2147483647 * Math.random()) * ms % 1e10;

  let song_url = new Promise((resolve, reject) => {
    _getSongUrl(musicData.songmid, _guid).then(res => {
      resolve(res.data.items[0].vkey);
    });
  });

  return song_url.then(_vkey => {
    return new Song({
      id: musicData.songid,
      mid: musicData.songmid,
      singer: filterSinger(musicData.singer),
      name: musicData.songname,
      album: musicData.albumname,
      duration: musicData.interval,
      image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${ musicData.albummid }.jpg?max_age=2592000`,
      url: `http://dl.stream.qqmusic.qq.com/C400${ musicData.songmid }.m4a?vkey=${ _vkey }&guid=${ _guid }&uin=0&fromtag=66`
    });
  });
}

function _getSongUrl(songMid, _guid) {
  let url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg';

  let data = Object.assign({}, commonParams, {
    hostUin: 0,
    cid: 205361747,
    needNewCode: 0,
    songmid: songMid,
    filename: `C400${ songMid }.m4a`,
    platform: 'yqq',
    format: 'json',
    g_tk: 673815377,
    guid: _guid
  });

  return jsonp(url, data, {
    params: 'MusicJsonCallback'
  });
}

/*
 * 处理一首歌是两个歌手的边界值操作 | 以 '/' 分割
 */
function filterSinger(singer) {
  let result = [];

  if (!singer) return '';

  singer.forEach(item => {
    result.push(item.name);
  });
  // join() 方法用于把数组中的所有元素转换一个字符串
  return result.join(' / ');
}

export function isValidMusic(musicData) {
  return musicData.songid && musicData.albummid && (!musicData.pay || musicData.pay.payalbumprice === 0);
};

export function processSongsUrl(songs) {
  if (!songs.length) {
    return Promise.resolve(songs);
  }
  return getSongsUrl(songs).then((res) => {
    if (res.code === ERROR_OK) {
      let midUrlInfo = res.url_mid.data.midurlinfo;
      midUrlInfo.forEach((info, index) => {
        let song = songs[index];
        song.url = `http://dl.stream.qqmusic.qq.com/${ info.purl }`;
      });
    }
    return songs;
  });
};
