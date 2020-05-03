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
export default class WPhone extends Component<IProps> {

  static defaultProps = {
    system: {},
    text: '绑定',
  }
  static options = {
    addGlobalClass: true
  }

  constructor(props) {
    super(props)
    this.getPhoneNumber = this.getPhoneNumber.bind(this)

  }

  getPhoneNumber(e) {

    let that = this;
    console.log(e);
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      Taro.showLoading();
      let detail = e.detail;

      console.log('getPhoneNumber:');
      console.log(detail);

      let {dispatch, system, onSuccess} = that.props;

      dispatch && system && dispatch({
        type: 'user/wxPhone',
        payload: {sessionKey: system.session_key, encryptedData: detail.encryptedData, iv: detail.iv}
      }).then((res) => {
        Taro.hideLoading();
        onSuccess && onSuccess();
      }).catch((e) => {
        console.log(e)
        Taro.hideLoading();
        Taro.showToast({title: '授权手机号失败，请重新授权', icon: 'none'});
      })
    }
  }

  render() {
    return (
      <Button className='btn-bind-phone' openType='getPhoneNumber'
              onGetPhoneNumber={this.getPhoneNumber}>{this.props.text}</Button>);
  }
}



