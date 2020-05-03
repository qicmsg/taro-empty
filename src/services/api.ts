import request from '../utils/request';

const domain = process.env.HTTP_DOMAIN;

export async function getSessionKey(params) {
  return request(domain + '/api/v1/thirdParty/wechat/getSessionKey', {
    method: "POST",
    data: params
  });
}

export async function wxLogin(params) {
  return request(domain + '/api/v1/thirdParty/wechat/getUser', {
    method: "POST",
    data: params
  });
}

export async function wxPhone(params) {
  return request(domain + '/api/v1/thirdParty/wechat/getPhone', {
    method: "POST",
    data: params
  });
}

export async function logout() {
  return request(domain + '/api/v1/login/out', {});
}

