import Taro, {Component, Config} from '@tarojs/taro'
import {View, Text, Video} from '@tarojs/components'
import {connect} from "@tarojs/redux";

import './index.scss'

interface IProps {
  user,
  dispatch: Function,
}


@connect(({user}) => ({
  user
}))
export default class Index extends Component<IProps> {

  static defaultProps = {
    user: {},
    dispatch: () => {
    }
  }

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '首页'
  }

  constructor(props) {
    super(props)
    this.updateUser = this.updateUser.bind(this);
  }

  componentWillMount() {
  }

  componentDidMount() {
    Taro.login({
      success: res => {
        console.log(res)
      },
      fail: err => {
        console.log('login fail', err);
      }
    });
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  updateUser() {
    let u = this.props.dispatch({
      type: 'user/setUser',
      payload: {
        userid: 1,
        username: 'chen',
        headimg: 'https://',
        token: 'abc'
      }
    })
    console.log('dispatch:user:')
    console.log(u)

    let user = this.props.dispatch({
      type: 'user/getUser'
    })
    console.log(user)
  }

  render() {
    return (
      <View className='index'>
        <Video src='http://wpic.inspire-auto.cn/aaf61ca6-4149-45a3-a30c-2fbe52c3d095.mp4' poster='http://wpic.inspire-auto.cn/a8ed8323-aae3-45c6-a83a-7cda0421034a.jpg'/>
        <Text>Hello world!!</Text>
        <View onClick={() => {
          this.updateUser()
        }}>更新用户</View>
      </View>
    )
  }
}
