import {keys, cache} from '../utils/storage'
import {wxLogin, wxPhone, logout} from "../services/api";
import Err from "../types/err";
import User from "../types/user";
import RoleEnum from '../enum/role'

const data: User = {
  UserId: '',
  UserName: '',
  NickName: '',
  Phone: '',
  Token: '',
  Avatar: '',
  Role: RoleEnum.User,
}

export default {

  namespace: 'user',

  state: {...data},

  subscriptions: {
    setup({dispatch, history}) {
    },
  },

  effects: {
    * wxLogin({payload: params}, {select, call, put}) {
      try {
        yield put({type: 'popularize/get'});
        const popularize = yield select((state) => state.popularize);
        if (popularize.pop_uid > 0) {
          params = {...params, ...popularize}
        }
        const result = yield call(wxLogin, params);

        console.log(result);
        let code = result.code;

        switch (code) {
          case 126://授权失败，可能session_key已无效，重新获取
            yield put({
              type: 'system/getSessionKey', update: true
            });
            throw {msg: 'session_key无效'};
          case 200:
            let user = result.data.user;
            let expire = result.data.expire;
            yield put({type: 'setUser', user, expire});
            // !!resolve && resolve(user);
            return user;
          default:
            throw {msg: result.msg};
        }
      } catch (e) {
        console.error(e);
        // !!reject && reject(e);
        throw e;
      }
    },
    * wxPhone({payload: params}, {call, put}) {
      try {
        const result = yield call(wxPhone, params);

        console.log(result);
        let code = result.code;

        switch (code) {
          case 126://授权失败，可能session_key已无效，重新获取
            yield put({
              type: 'system/getSessionKey', update: true
            });
            //yield put({type: 'clearUser'});
            throw {msg: 'session_key无效'};
          case 200:
            let user = result.data.user;
            let expire = result.data.expire;
            yield put({type: 'setUser', user, expire});
            // !!resolve && resolve(user);
            return user;
          default:
            throw {msg: result.msg};
        }
      } catch (e) {
        console.error(e);
        // !!reject && reject(e);
        throw e;
      }
    },
    * logout({}, {call, put}) {
      const result = yield call(logout);
      yield put({type: 'clearUser'});
    },
  },

  reducers: {
    setUser(state, {user, expire}) {
      cache.set(keys.user, user, expire);//7天
      return {...state, ...user};
    },
    setPhone(state, {user, expire}) {
      cache.set(keys.user, user, expire);//7天
      return {...state, ...user};
    },
    initLocalUser(state) {
      let user = cache.get(keys.user) || {};

      return {...state, ...user};
    },
    clearUser(state) {
      cache.remove(keys.user);
      return {
        ...state, ...{
          userid: 0,
          username: '',
          nickname: '',
          phone: '',
          headimg: '',
          token: '',
          vip: 0,
          vipinfo: {}
        }
      };
    }
  },

};
