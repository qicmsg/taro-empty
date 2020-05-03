import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'

import '../../styles/components/FloatButtonWrap.scss'

interface IProps {
  className?: string,
}

export default class FloatButtonWrap extends Component<IProps> {

  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    className: '',
  }

  state = {
    contactTop: 0
  }

  constructor(props) {
    super(props)
  }


  render() {
    let {contactTop} = this.state;
    return (
      <View className={`float-btn-wrap ${this.props.className}`}
            style={contactTop > 0 ? {top: contactTop + 'px', bottom: 'auto'} : {}}
            onTouchMove={(e) => {
              console.log(e)
              e.stopPropagation();
              let top = e.touches[0].clientY;
              top = top < 10 ? 10 : top;
              this.setState({
                contactTop: e.touches[0].clientY
              })
            }}>
        {
          this.props.children
        }
      </View>
    );
  }
}



