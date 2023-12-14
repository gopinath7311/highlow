import jwtDecode from 'jwt-decode';
import http from './httpService';
import AsyncStorage from '@react-native-async-storage/async-storage';

import helpers from '../../cryptos';

const apiEndpoint = 'game/';

export async function startingnumber(user) {
  const {data} = await http.post(apiEndpoint + 'start/', {});
  const decry = helpers.decryptobj(data);
  return decry;
}
export async function guessnum(user) {

    const userobj = helpers.encryptobj(user);
    const {data} = await http.post(apiEndpoint + 'guess/', {enc:userobj});
    const decry = helpers.decryptobj(data);
    return decry;
  }
  export async function history(user) {
    const userobj = helpers.encryptobj(user);
    const {data} = await http.post(apiEndpoint + 'history/', {enc:userobj});
    const decry = helpers.decryptobj(data);
    return decry;
  }
  export async function guessdata(user) {
    const userobj = helpers.encryptobj(user);
    const {data} = await http.post(apiEndpoint + 'guessdata/', {enc:userobj});
    const decry = helpers.decryptobj(data);
    return decry;
  }
export default {
  startingnumber,
  guessnum,
  history,
  guessdata
};
