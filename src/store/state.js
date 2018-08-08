
const playMode = {
  sequence: 0, // 顺序播放
  loop: 1, // 单曲循环
  random: 2 // 随机播放
};

const state = {
  singer: {}, // 歌手信息
  playing: false, // 播放器播放状态
  fullScreen: false, // 播放器展开状态
  playlist: [], // 播放歌曲列表
  sequenceList: [], // 顺序播放列表
  mode: playMode.sequence, // 播放模式
  currentIndex: -1, // 当前播放歌曲索引
  songList: {}, // 推荐页歌单
  rankList: {} // 歌曲排行数据
};

export default state;
