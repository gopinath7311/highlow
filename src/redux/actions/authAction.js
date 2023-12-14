import store from '../index';
import auth from '../../services/authService';
import http from '../../services/httpService';

export var UPDATE_AUTH = 'UPDATE_AUTH';

function update_auth() {
  setTimeout(async () => {
    try {
      await http.setJwt();
      const authy = await auth.getCurrentUser();
//console.log(authy,"authy")
      store.dispatch({type: UPDATE_AUTH, payload: authy});
    } catch (error) {}
  }, 100);
}

export default update_auth;
