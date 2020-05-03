import {getSessionKey} from '../services/api'
import {keys, cache} from '../utils/storage'
import {wxCheckSession, wxLogin} from '../utils/common'

export default {

  namespace: 'system',

  state: {
    session_key: '',
  },

  effects: {
    * wxLogin({}, {call, put}) {
      try {
        const code = yield call(wxLogin);
        const data = yield call(getSessionKey, {code});
        if (data.code == 200) {
          let session_key = data.data.session_key;
          console.log('getSessionKey:');
          console.log(data.data);
          yield put({type: 'setSessionKey', payload: {session_key: session_key}});
        }
        else {
          throw '获取session_key失败';
        }
      }
      catch (e) {
        yield put({type: 'setSessionKey', payload: {session_key: null}});
      }
    },
    * getSessionKey({update}, {call, put, select}) {
      let session_key = cache.get(keys.session_key);
      if (update !== true && session_key) {
        try {

          yield call(wxCheckSession);
          const sessionkey = yield select((state) => state.system.session_key);
          session_key != sessionkey && (yield put({type: 'loadSessionKey', payload: {session_key: session_key}}));
        }
        catch (e) {
          yield put({type: 'wxLogin', payload: {}});
        }
      }
      else {
        yield put({type: 'wxLogin', payload: {}});
      }
    },
  },

  reducers: {
    setSessionKey(state, {payload}) {
      cache.set(keys.session_key, payload.session_key, 3600 * 24 * 2);
      return {...state, ...payload};
    },
    loadSessionKey(state, {payload}) {
      return {...state, ...payload};
    },
  },

};
