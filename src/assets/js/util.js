
/*
 * 洗牌函数 | 打乱数组
 */
export function shuffle(array) {
  for (let i = 0; i < array.length; i++) {
    let j = getRandomInt(0, i);
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/*
 * 返回作用域内的一个数字 (包含 头和尾)
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
