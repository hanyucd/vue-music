
// 向 dom 添加 class
export function domAddClass(el, className) {
  if (domHasClass(el, className)) {
    return;
  }

  // 将 dom 中所有的 class 转为以空格为分隔符的 数组
  let newClass = el.className.split(' ');
  newClass.push(className);
  // 添加 class 属性到 dom 中
  el.className = newClass.join(' ');
};

// 判断 dom 是否有该 class
export function domHasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
  // test() 检索字符串中指定的值
  return reg.test(el.className);
};
