import Taro, {useState, useEffect} from '@tarojs/taro'
import {View, Button} from '@tarojs/components'


import {useSelector, useDispatch} from '@tarojs/redux'

function HookTest() {
  console.log('HookTest')
  //const store = useStore();  //显示的是全局state里的数据，可以在只读state里数据时引用，例接口读取token
  const state = useSelector((store: { user }) => {
    return {user: store.user};
  });

  const user = state.user;


  const dispatch = useDispatch();

  console.log(user)

  const updateUser = () => {
    console.log('update-user')
    dispatch({
      type: 'user/setUser',
      payload: {
        userid: 2,
        username: 'chen7',
      }
    })
  }

  const [count, setCount] = useState(0);
  useEffect(() => {
    console.log(count)
    console.log(user)
    console.log(state)
    //console.log(store.getState())
  });

  return (
    <div>
      <View>You clicked {count} times</View>
      <Button onClick={() => setCount(count + 1)}>
        Click me
      </Button>
      <View>用户名：{user.username}</View>
      <View onClick={updateUser}>---更新user</View>
    </div>
  );
}

export default HookTest;
/*export default connect(({user}) => ({
  user
}), null)(Test)*/
