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
 * 设置 搜索缓存
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
 * 获取搜索缓存 | 提供给 vuex 中 state 使用
 */
export function getSearch() {
  return storage.get(SEARCH_KEY, []);
};
