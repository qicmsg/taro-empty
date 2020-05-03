import Taro, {Component} from '@tarojs/taro'
import {connect} from '@tarojs/redux'
import {Button} from '@tarojs/components'

import '../style/components/wxLogin.scss'

interface IProps {
  onSuccess?: Function,
  system?: { session_key },
  text?: String,
  dispatch?: Function
}

/*@connect(({system}) => ({
  system
}))*/


@connect(({system}) => {
  let models: { system?: any } = {system}
  return models
})
export default class WLogin extends Component<IProps> {

  static defaultProps = {
    system: Object,
    text: '登录',
  }
  static options = {
    addGlobalClass: true
  }

  constructor(props) {
    super(props)
    this.getUserInfo = this.getUserInfo.bind(this)

  }

  getUserInfo(e) {
    let that = this;
    let {dispatch, system, onSuccess} = that.props;
    Taro.showLoading();
    let detail = e.detail;
    if (detail.errMsg == 'getUserInfo:ok') {
      dispatch && dispatch({
        type: 'user/wxLogin',
        payload: {sessionKey: system ? system.session_key : '', encryptedData: detail.encryptedData, iv: detail.iv}
      }).then((res) => {
        Taro.hideLoading();
        onSuccess && onSuccess();
      }).catch((e) => {
        console.log(e)
        Taro.hideLoading();
        Taro.showToast({title: '授权登录失败，请重新授权', icon: 'none'});
      })
    }
    console.log(detail);
  }

  render() {
    return (
      <Button className='btn-login' openType='getUserInfo' onGetUserInfo={this.getUserInfo}>{this.props.text}</Button>);
  }
}



