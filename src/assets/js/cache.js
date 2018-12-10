import storage from 'good-storage';

// 搜索 key
const SEARCH_KEY = '__search__';
// 搜索最多缓存 15 条
const SEARCH_MAX_LENGTH = 15;

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

/*
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
 * 获取搜索历史缓存 | 提供给 vuex 中 state 使用
 */
export function getSearch() {
  return storage.get(SEARCH_KEY, []);
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
