import http from './httpService';
import helpers from '../../cryptos';


export async function backEndCallObj(route, obj) {

  const userob = helpers.encryptobj(obj);
  const datat = await http.post(route, {enc: userob});
  return helpers.decryptobj(datat.data);
}

export async function backEndCallObjNoDcyt(route, obj) {
  const userob = helpers.encryptobj(obj);
  const datat = await http.post(route, {enc: userob});
  return datat.data;
}

export async function backEndCall(route) {

  const data = await http.post(route);
  const decry = helpers.decryptobj(data);
  return decry
}

export async function backEndCallObjNEnc(route, obj) {
  http.setJwt();
  const {data} = await http.post(route, obj);
  return helpers.decryptobj(data);
}


export default {
  backEndCall,
  backEndCallObj,
  backEndCallObjNoDcyt,
  backEndCallObjNEnc,
};
