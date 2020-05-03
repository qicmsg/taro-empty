import Taro, {Component} from '@tarojs/taro'

type checkLoginParams = {
  bindPhone: boolean,
  showMessage?: boolean,
  messageText?: string
}

export function checkLogin(params?: checkLoginParams) {
  let {bindPhone: bindphone, showMessage, messageText} = params || {};

  if (bindphone === undefined) bindphone = false;
  if (showMessage === undefined) showMessage = false;
  //if (!messageText) messageText = '请登录';

  return (target, name, descriptor) => {
    var fun = descriptor.value;
    descriptor.value = function () {
      //console.log(`Calling ${name} with`, arguments);

      let user = Taro['$store'].getState().user;
      //console.log(user);
      if (!user.token) {
        if (showMessage) {
          Taro.showToast({title: messageText ? messageText : '请登录', icon: 'none'});
        } else {
          Taro.showModal({
            title: '登录',
            content: '登录后才可以执行此操作，是否登录？',
            confirmText: '登录',
            success(res) {
              if (res.confirm) {
                //TODO 登录页面
                let loginpage = process.env.LOGIN_PAGE;
                Taro.navigateTo({
                  url: (loginpage + '?bindphone=' + (bindphone ? 1 : 0))
                })

              }
            }
          })
        }
      } else if (bindphone && !user.phone) {
        if (showMessage) {
          Taro.showToast({title: messageText ? messageText : '请绑定手机号', icon: 'none'});
        } else
          bindPhone();
      } else {
        return fun.apply(this, arguments);
      }
    };
    return descriptor;
  }
}

function bindPhone() {
  Taro.showModal({
    title: '绑定手机号',
    content: '绑定手机号后才可以执行此操作，是否绑定？',
    confirmText: '绑定',
    success(res) {
      if (res.confirm) {
        //TODO 登录页面
        let loginpage = process.env.LOGIN_PAGE;
        Taro.navigateTo({
          url: loginpage + '?bindphone=1'
        })
      }
    }
  })
}

export function checkBindPhone(target, name, descriptor) {
  var fun = descriptor.value;
  descriptor.value = function () {
    //console.log(`Calling ${name} with`, arguments);

    let user = Taro['$store'].getState().user;
    //console.log(user);
    if (!user.phone) {
      bindPhone();
    } else {
      return fun.apply(this, arguments);
    }
  };
  return descriptor;
}

/*export const analytics = {
  pv(pvType: PvType) {
    return function decorator<T extends { new(...args: any[]): Component }>(target: T) {
      return class extends target {
        componentDidMount() {
          console.log('baseClass:componentDidMount')
          console.log(this.$router.params)

          //可以统计pv

          console.log(pvType)

          try {
            let pid: string = '';
            switch (pvType) {
              case PvType.product:
                pid = this.$router.params['id']
                break;

              case PvType.article:
                pid = this.$router.params['id']
                break;
            }
            analytics_pv({pvtype: pvType, pid: pid});
          } catch (e) {

          }

          super.componentDidMount && super.componentDidMount()
        }
      }
    }
  },

  click(action: string, path: string) {

    return (target, name, descriptor) => {
      var fun = descriptor.value;
      descriptor.value = function () {
        console.log(`Calling ${name} with`, arguments);

        analytics_click({action, path});

        return fun.apply(this, arguments);
      };
      return descriptor;
    }
  }
}*/


export function analytics2<T extends { new(...args: any[]): Component }>(target: T) {
  //console.log('classTest:' + target);
  return class extends target {
    /**
     * 挂载后
     */
    componentDidMount() {
      console.log('baseClass:componentDidMount')
      console.log(this.$router.params)

      //可以统计pv

      super.componentDidMount && super.componentDidMount()
    }

    /**
     * 卸载载
     */
    componentWillUnmount() {
      console.log('baseClass:componentWillUnmount')

      //可以计算停留时间

      super.componentWillUnmount && super.componentWillUnmount()
    }
  }
}
