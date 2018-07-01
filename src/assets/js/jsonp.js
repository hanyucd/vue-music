import originJSONP from 'jsonp';

export default function jsonp(url, data, option) {
  url += ((url.indexOf('?') === -1) ? '?' : '&') + param(data);

  return new Promise(function(resolve, reject) {
    originJSONP(url, option, (error, data) => {
      if (!error) {
        resolve(data);
      } else {
        reject(error);
      }
    });
  });
};

function param(data) {
  let url = '';

  for (let key in data) {
    let value = data[key] !== undefined ? data[key] : '';
    url += `&${ key }=${ encodeURIComponent(value) }`; // 字符串进行编码
  }
  // 删掉第一个 &
  return url ? url.substring(1) : '';
}
