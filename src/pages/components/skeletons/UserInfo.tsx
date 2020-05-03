import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'

export default class NoLogin extends Component {

  state: { on: boolean };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  render() {
    return (
      <View className='index'>
        未登录
      </View>
    )
  }
}
