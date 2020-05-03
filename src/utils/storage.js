import Taro from '@tarojs/taro'

export const keys = {
  user: '_user',
  index_focus_series: 'index_focus_series',
  session_key: 'session_key',
  search_history: 'search_history',
  carts: '_carts',
  popularize: '_popularize',
};

export const cache = {
  set(key, val, expire = 0) {
    return Taro.setStorageSync(key, JSON.stringify({
      v: val,
      t: expire === 0 ? 0 : parseInt((new Date()).getTime() / 1000) + expire
    }))
  },
  get(key) {
    let value = null, data = Taro.getStorageSync(key);
    if (data) {
      let _v = JSON.parse(data);
      if (_v.t === 0 || _v.t >= parseInt((new Date()).getTime() / 1000)) {
        value = _v.v;
      } else {
        cache.remove(key);
        value = null;
      }
    }
    return value;
  },
  getExpire(key) {
    let exp = -1, data = Taro.getStorageSync(key);
    if (data) {
      let _v = JSON.parse(data);
      if (_v.t === 0) {
        exp = 0
      } else {
        exp = _v.t - parseInt((new Date()).getTime() / 1000)
        exp = exp <= 0 ? -1 : exp
      }
    }
    return exp;
  },
  remove(key) {
    Taro.removeStorageSync(key);
  },
  clear() {
    Taro.clearStorageSync();
  }
}
