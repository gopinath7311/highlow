import axios from 'axios';

import helpr from '../../cryptos';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-tiny-toast';
 import {REACT_NATIVE_APP_API_URL} from "@env"
 //console.log(REACT_NATIVE_APP_API_URL,"url")
axios.defaults.baseURL = REACT_NATIVE_APP_API_URL;


axios.interceptors.response.use(null, error => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;
  if (!expectedError) {
    Alert.alert(
      'Alert',
      'There is difficulty in Processing the Request. Please Try Again Later',
      [{text: 'OK', onPress: () => Toast.hide()}],
      {
        cancelable: false,
      },
    );
  }
  return Promise.reject(error);
});

async function setJwt() {
  const jst = await AsyncStorage.getItem('token');
  var dec = jst;
  if (dec) {
    axios.defaults.headers.common['x-auth-token'] = dec;
  }
}

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setJwt,
};
