import jwtDecode from 'jwt-decode';
import http from './httpService';
import AsyncStorage from '@react-native-async-storage/async-storage';

import helpers from '../../cryptos';
export async function callBackendObj(route, obj) {
    const userob = helpers.encryptobj(obj);
  const data = await http.post(route, {enc: userob});
  const decry = helpers.decryptobj(data);
  return decry;
  }
  export default {
    callBackendObj,

  };