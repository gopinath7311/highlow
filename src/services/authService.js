import jwtDecode from 'jwt-decode';
import http from './httpService';
import AsyncStorage from '@react-native-async-storage/async-storage';

import helpers from '../../cryptos';

const apiEndpoint = 'user/';
const tokenKey = 'token';

export async function register(user) {
  const userobj = helpers.encryptobj(user);

  const {data} = await http.post(apiEndpoint +'registration/',{enc:userobj});
  const decry= helpers.decryptobj(data);
  return decry
 
}

export async function login(user) {

   const userobj = helpers.encryptobj(user);
 
   const {data} = await http.post(apiEndpoint +'login/',{enc:userobj});
   const decry= helpers.decryptobj(data);
   const da = await AsyncStorage.setItem(tokenKey,decry.token);

   return decry
  
}



export async function getCurrentUser() {
    try {
      const jwt = await AsyncStorage.getItem(tokenKey);
   
    const data=jwtDecode(jwt)
   return data
     
    } catch (ex) {
      return ex;
    }
  }
  export async function logout(props) {

    const navigation=props.navigation
 
      try {
        const ret = await AsyncStorage.removeItem(tokenKey);
        setTimeout(() => {
         
          navigation.push("login")
        }, 1000);
    
        return ret;
      } catch (error) {
        return error;
      }
    }

export default {

  login,
 register,
 getCurrentUser,
logout,
};

