import * as types from './mutations-type';
import { shuffle } from '@/assets/js/util';

import { saveSearch } from '@/assets/js/cache';

/*
 * 封装内部方法 | 查找索引
 */
function findIndex(list, song) {
  return list.findIndex(item => {
    return item.id === song.id;
  });
}

/*
 * 选择歌曲播放 | Actions
 */
export const selectPlay = function({ commit, state }, { list, index }) {
  commit(types.SET_SEQUENCE_LIST, list);
  // 若当前播放模式为随机
  if (state.mode === 2) {
    let randomList = shuffle(list);
    commit(types.SET_PLAY_LIST, randomList);
    index = findIndex(randomList, list[index]);
  } else {
    commit(types.SET_PLAY_LIST, list);
  }
  commit(types.SET_CURRENT_INDEX, index);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};

/*
 * 随机播放歌曲 | Actions
 */
export const randomPlay = function({ commit }, { list }) {
  commit(types.SET_MODE, 2);
  commit(types.SET_SEQUENCE_LIST, list);

  let randomList = shuffle(list);
  commit(types.SET_PLAY_LIST, randomList);

  commit(types.SET_CURRENT_INDEX, 0);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};

/*
 * 新增歌曲到播放列表 | Actions
 */
export const insertSong = function({ commit, state }, song) {
  let playlist = state.playlist.slice();
  let sequenceList = state.sequenceList.slice();
  let currentIndex = state.currentIndex;

  // 记录当前歌曲
  let currentSong = playlist[currentIndex];
  // 查询待添加的歌曲是否已在播放列表中
  let fpIndex = findIndex(playlist, song);
  // 插入到当前索引
  currentIndex++;
  playlist.splice(currentIndex, 0, song);
  // 如果待添加的歌曲已在播放列表中，删除原有歌曲
  if (fpIndex > -1) {
    if (currentIndex > fpIndex) {
      playlist.splice(fpIndex, 1);
      currentIndex--;
    } else {
      playlist.splice(fpIndex + 1, 1);
    }
  }

  // 插入到 sequenceList 中的位置
  let currentSIndex = findIndex(sequenceList, currentSong) + 1;
  // 查询待添加的歌曲是否已在 sequenceList 列表中
  let fsIndex = findIndex(sequenceList, song);
  // 插入到当前索引
  sequenceList.splice(currentSIndex, 0, song);
  // 如果待添加的歌曲已在播放列表中，删除原有歌曲
  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1);
    } else {
      sequenceList.splice(fsIndex + 1, 1);
    }
  }

  commit(types.SET_PLAY_LIST, playlist);
  commit(types.SET_SEQUENCE_LIST, sequenceList);
  commit(types.SET_CURRENT_INDEX, currentIndex);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};

/*
 * 保存搜索历史 | Actions
 */
export const saveSearchHistory = function({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query));
};
