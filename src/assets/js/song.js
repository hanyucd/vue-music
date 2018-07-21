
// 创建一个歌曲类
export default class Song {
  constructor({ id, mid, singer, name, album, duration, image, url }) {
    this.id = id;
    this.mid = mid;
    this.singer = singer;
    this.name = name;
    this.album = album;
    this.duration = duration;
    this.image = image;
    this.url = url;
  }
}

// 工厂方法 | 单例模式
export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${ musicData.albummid }.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/${ musicData.songid }.m4a?fromtag=46`
  });
}

/*
 * 处理一首歌是两个歌手的边界值操作
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
