import Taro from '@tarojs/taro';

const app_source = process.env.APP_SOURCE;


function checkStatus(response) {

  console.log(response)
  if (response.statusCode >= 200 && response.statusCode < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "request"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  const defaultOptions = {}
  let newOptions = {...defaultOptions, ...options};

  let user = Taro['$store'].getState().user;

  newOptions.header = {
    ...newOptions.header, ...{
      Accept: 'application/json',
      'token': user.token,
      'App-Source': app_source
    }
  };

  if (!newOptions.header['Content-Type']) {
    newOptions.header['Content-Type'] = 'application/json; charset=utf-8';
  }

  let login = () => {
    Taro['$store'].dispatch({
      type: 'user/clearUser'
    })

    if (isShowModal) {
      isShowModal = false;
      Taro.showModal({
        title: '登录',
        content: '登录已过期，是否重新登录？',
        success(res) {
          isShowModal = true;
          if (res.confirm) {
            //TODO 登录页面
            let loginpage = process.env.LOGIN_PAGE;
            Taro.navigateTo({
              url: (loginpage + '?bindphone=0')
            })
          }
        }
      })
    }
  }

  let isShowModal = true;
  return Taro.request({url, ...newOptions})
    .then(checkStatus)
    //.then(parseJSON)
    .then(response => {
      if (response.data.code == 401) {
        login()
      }
      return response.data
    })
    .catch(function (err) {
      if (err.response.statusCode == 401) {
        login()
      }
      return Promise.reject(err.response.data || err)
    });
}

Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => {
      throw reason
    })
  );
};
