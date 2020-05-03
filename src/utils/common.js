import Taro from '@tarojs/taro'

function formatNumber(n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

function leftFormat(num, len = 2) {
  return (Array(len).join('0') + num).slice(-len);
}

export function replaceAll(str, regexp, replacement) {
  var reg = new RegExp(regexp, "g");
  return str.replace(reg, replacement);
}

export function stringToDate(str) {
  return new Date(str.replace(/-/g, "/"));
}

export function formatTime(date) {
  date = typeof datetime == 'string' ? new Date(date.replace(/-/g, "/")) : date;
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('-')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

export function formatDate(date) {
  if (!date) return '';
  date = typeof date == 'string' ? new Date(date.replace(/-/g, "/")) : date;
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  //const hour = date.getHours()
  //const minute = date.getMinutes()
  //const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('-')
  //const t2 = [hour, minute, second].map(formatNumber).join(':')

  return t1
}

export function shortDateFormat(datetime, showTime = true) {
  let date = typeof datetime == 'string' ? new Date(datetime.replace(/-/g, "/")) : datetime;
  let y = date.getFullYear();
  let m = date.getMonth() + 1;
  let d = date.getDate();
  let h = leftFormat(date.getHours());
  let i = leftFormat(date.getMinutes());
  let curYear = (new Date()).getFullYear();

  let now = new Date();
  if (!showTime) {
    return (y == curYear ? '' : y + '.') + leftFormat(m) + '.' + leftFormat(d);
  }
  if (y == now.getFullYear() && m == now.getMonth() + 1 && d == now.getDate()) {
    return h + ':' + i;
  }
  return (y == curYear ? '' : y + '.') + leftFormat(m) + '.' + leftFormat(d) + ' ' + h + ':' + i;
}

export const html = {
  decode(str) {
    return str
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, "\"")
      .replace(/&#39;/g, "\'")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&");
  },
  encode(str) {
    return str
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
      .replace(/ /g, "&nbsp;")
      .replace(/&/g, "&amp;");
  }
}

export function moneyFormat(money, num = 1) {
  return money > 100000 ? `${(money / 10000).toFixed(num)}万` : `${parseInt(money)}元`;
}

export function priceFloatFormat(float) {
  return float < 0 ? `降${moneyFormat(Math.abs(float))}` : `升${moneyFormat(parseInt(float))}`;
}

export function percentFormat(float, num = 1) {
  return float < 0 ? `↓${Math.abs(float / 1).toFixed(num)}%` : `↑${(float / 1).toFixed(num)}%`;
}

export const imageSize = {
  param: 'x-oss-process',
  style: {
    /**
     * 宽高240*240
     */
    wh240: 'wh240',

    /**
     * 宽高750*750
     */
    wh750: 'wh750',

    /**
     * 宽640，高自适应
     */
    w640: 'w640',

    /**
     * 焦点图
     */
    focusImg: 'focusimg',
  },
  format(url, style) {
    url = url || ''
    if (url.indexOf('x-oss-process') > 0) {
      url = url.replace(/(x-oss-process=style\/)([^&]+)/, '$1' + style);
    }
    else {
      url = url + (url.indexOf('?') > 0 ? '&' : '?') + ('x-oss-process=style/' + style);
    }
    return url
  },
  original(url) {
    return url.replace(/(x-oss-process=style\/)([^&]+)/, '');
  },
  focusImg(url, style = 'focusimg') {
    switch (style) {
      case 'focusimg':
        break;
      default:
        return url;
    }
    return imageSize.format(url, style);
  }
}

export async function wxCheckSession() {
  return new Promise(function (resolve, reject) {
    Taro.checkSession({
      success() {
        //session_key 未过期，并且在本生命周期一直有效
        resolve(true)
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        //wx.login() //重新登录
        reject(false)
      }
    })
  });
}

export async function wxLogin() {
  return new Promise(function (resolve, reject) {
    Taro.login({
      success(res) {
        console.log('wx.login');
        console.log(res);
        if (res.errMsg == 'login:ok') {
          resolve(res.code)
        }
        else {
          reject()
        }
      },
      fail() {
        reject()
      }
    });
  });
}


/**
 * 获取当前页面
 * @returns {{url: string, queryString: string}}
 */
export function getCurrentPage() {
  let pages = Taro.getCurrentPages();

  let currentPage = pages[pages.length - 1]    //获取当前页面的对象
  let url = '/' + currentPage.route    //当前页面url
  let options = currentPage.options    //如果要获取url中所带的参数可以查看options

  //拼接url的参数
  let params = [];

  for (let key in options) {
    let value = options[key]
    params.push(key + '=' + value);
    //urlWithArgs += key + '=' + value + '&'
  }
  return {
    url, queryString: params.join('&')
  }
}


export function previewImage(params) {
  //url.replace('https://img.tea.earabc.com', 'http://img.tea.earabc.com')
  let s = 'https://img.tea.earabc.com';
  let r = 'http://img.tea.earabc.com';
  let current = params.current.replace(s, r);
  let urls = [];
  params.urls.map(url => {
      urls.push(url.replace(s, r))
    }
  );
  params.current = current;
  params.urls = urls;
  Taro.previewImage(params)
}

export class ScrollPosition {
  scrollWidth = 0;
  scrollLeft = 0;

  init(id, callback, scope) {
    let that = this;
    var query = null
    var query = Taro.createSelectorQuery()
    if (scope) query = query.in(scope);
    query.select('#' + id).boundingClientRect(function (rect) {
      console.log('boundingClientRect---------')
      console.log(rect)
      that.scrollWidth = rect.width;
      callback(that.scrollWidth)
    }).exec();
  }

  getLeft(target, callback, scope) {
    let that = this;
    let left = target.offsetLeft;
    left = left >= 0 ? left : 0;
    var query = Taro.createSelectorQuery()
    if (scope) query = query.in(scope);
    query.select('#' + target.id).boundingClientRect(function (rect) {
      let width = rect.width;
      if (left > that.scrollWidth / 2) {
        that.scrollLeft = left - that.scrollWidth / 2 + width / 2;
      }
      else if (left < that.scrollWidth / 2) {
        that.scrollLeft = 0;
      }
      callback(that.scrollLeft)
    }).exec();
  }
}


