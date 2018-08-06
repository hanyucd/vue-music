
/*
 * 洗牌函数 | 打乱数组
 */
export function shuffle(array) {
  // 复制一个数组
  let _array = array.slice();

  for (let i = 0; i < _array.length; i++) {
    let j = getRandomInt(0, i);
    [_array[i], _array[j]] = [_array[j], _array[i]];
  }
  return _array;
}

/*
 * 返回作用域内的一个数字 (包含 头和尾)
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
