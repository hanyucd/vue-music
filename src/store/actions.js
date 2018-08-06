import * as types from './mutations-type';
import { shuffle } from '@/assets/js/util';

// 查找索引
function findIndex(list, song) {
  return list.findIndex(item => {
    return item.id === song.id;
  });
}

// 选择歌曲播放
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

// 随机播放歌曲
export const randomPlay = function({ commit }, { list }) {
  commit(types.SET_MODE, 2);
  commit(types.SET_SEQUENCE_LIST, list);

  let randomList = shuffle(list);
  commit(types.SET_PLAY_LIST, randomList);

  commit(types.SET_CURRENT_INDEX, 0);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};
