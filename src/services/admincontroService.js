import jwtDecode from 'jwt-decode';
import http from './httpService';
import AsyncStorage from '@react-native-async-storage/async-storage';

import helpers from '../../cryptos';

const apiEndpoint = 'admincontrols/';

export async function getadmincontrols(user) {
  const {data} = await http.post(apiEndpoint + 'getadmincontrols/', {});
  const decry = helpers.decryptobj(data);
  return decry;
}

export default {
    getadmincontrols,
};
