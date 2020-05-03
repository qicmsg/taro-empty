import '@tarojs/async-await'
import Taro, {Component, Config} from '@tarojs/taro'
import {Provider} from '@tarojs/redux'
import Index from './pages/index'

import dva from './utils/dva'
import models from './models'

import './styles/app.scss'
import './styles/font/iconfont.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }


const dvaApp = dva.createApp({
  initialState: {},
  models: models,
});
const store = dvaApp.getStore();


Taro['$store'] = store;

store.dispatch({
  type: 'user/initLocalUser'
});

store.dispatch({
  type: 'search/initLocalHistory'
});

store.dispatch({
  type: 'system/getSessionKey'
});


class App extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [

      'pages/index/index',
    ],
    tabBar: {
      color: '#666666',
      selectedColor: '#ff4337',
      borderStyle: 'black',
      backgroundColor: '#fefefe',
      list: [
        /*{
          pagePath: 'pages/index/index',
          text: '首页',
          iconPath: 'static/imgs/tabbar/home.png',
          selectedIconPath: 'static/imgs/tabbar/home_sel.png',
        }*/
      ]
    },
    window: {
      backgroundTextStyle: 'dark',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'taro',
      navigationBarTextStyle: 'black',
      backgroundColor: '#fff'
    },
    navigateToMiniProgramAppIdList: ['wxf4f3222'],
    permission: {
      "scope.userLocation": {
        "desc": "获取你的位置信息"
      }
    }
  }

  componentWillMount() {
    const updateManager = Taro.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      Taro.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      Taro.showModal({
        title: '更新提示',
        content: '新版本下载失败',
        showCancel: false
      })
    })
  }

  componentDidMount() {
    //let cpage = Taro.getCurrentPages();
    //let path = this.$router.params.path;
    /*if (path == 'pages/index/test') {
      Taro.redirectTo({
        url: '/pages/index/index'
      })
    }*/
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  componentDidCatchError() {
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Index/>
      </Provider>
    )
  }
}

Taro.render(<App/>, document.getElementById('app'))
