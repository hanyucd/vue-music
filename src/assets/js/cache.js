import storage from 'good-storage';

/**
 * localStorage 缓存数据
 */

// 设置 搜索 key
const SEARCH_KEY = '__search__';
// 搜索最多缓存 15 条
const SEARCH_MAX_LENGTH = 15;

// 设置 歌曲播放 key
const PLAY_KEY = '__PLAY__';
// 歌曲播放最多缓存 50 条
const PLAY_MAX_LENGTH = 50;

// 设置 收藏 key
const FAVORITE_KEY = '__favorite__';
// 收藏最多缓存 50 条
const FAVORITE_MAX_LENGTH = 50;

/*
 * 封装内部方法 | 插入数据到第一个 并 删除重复值
 */
function inseartArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare);
  if (index === 0) return;
  if (index > 0) {
    arr.splice(index, 1);
  }
  // 向数组前端插入值
  arr.unshift(val);
  if (maxLen && arr.length > maxLen) {
    // 移除数组最后一项
    arr.pop();
  }
}
/*
 * 封装内部方法 | 删除单个数据
 */
function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare);
  if (index > -1) {
    arr.splice(index, 1);
  }
}

/**
 * 设置 搜索历史缓存
 */
export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, []);
  inseartArray(searches, query, (item) => {
    return item === query;
  }, SEARCH_MAX_LENGTH);

  storage.set(SEARCH_KEY, searches);

  return searches;
};
/*
 * 删除 单条搜索历史缓存
 */
export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, []);
  deleteFromArray(searches, (item) => {
    return item === query;
  });

  storage.set(SEARCH_KEY, searches);
  return searches;
};
/*
 * 清空搜索历史
 */
export function clearSearch() {
  storage.remove(SEARCH_KEY);
  return [];
};
/*
 * 获取搜索历史缓存 | 提供给 vuex 中 state 使用
 */
export function getSearch() {
  return storage.get(SEARCH_KEY, []);
};

/**
 * 设置 播放历史缓存
 */
export function savePlay(song) {
  let songs = storage.get(PLAY_KEY, []);
  inseartArray(songs, song, (item) => {
    return item.id === song.id;
  }, PLAY_MAX_LENGTH);

  storage.set(PLAY_KEY, songs);

  return songs;
};
/*
 * 获取播放历史缓存 | 提供给 vuex 中 state 使用
 */
export function getPlay() {
  return storage.get(PLAY_KEY, []);
};

/**
 * 设置 收藏歌曲缓存
 */
export function saveFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, []);
  inseartArray(songs, song, (item) => {
    return item.id === song.id;
  }, FAVORITE_MAX_LENGTH);

  storage.set(FAVORITE_KEY, songs);

  return songs;
};
/*
 * 删除单个收藏
 */
export function deleteFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, []);
  deleteFromArray(songs, (item) => {
    return item.id === song.id;
  });

  storage.set(FAVORITE_KEY, []);
  return songs;
};
/*
 * 获取收藏缓存 | 提供给 vuex 中 state 使用
 */
export function getFavorite() {
  return storage.get(FAVORITE_KEY, []);
};
